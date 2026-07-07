import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import {
  Sprint,
  SprintDocument,
  SprintStatus,
} from './schemas/sprint.schema';

import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { SearchSprintDto } from './dto/search-sprint.dto';

@Injectable()
export class SprintService {
  constructor(
    @InjectModel(Sprint.name)
    private readonly sprintModel: Model<SprintDocument>,
  ) {}

  async create(
    createSprintDto: CreateSprintDto,
  ) {
    const existingSprint =
      await this.sprintModel.findOne({
        sprintId: createSprintDto.sprintId,
        isDeleted: false,
      });

    if (existingSprint) {
      throw new ConflictException(
        'Sprint ID already exists',
      );
    }

    const sprint =
      await this.sprintModel.create(
        createSprintDto,
      );

    return sprint;
  }

  async findAll() {
    return this.sprintModel
      .find({
        isDeleted: false,
      })
      .populate('projectId')
      .sort({
        createdAt: -1,
      });
  }

  async findOne(id: string) {
    const sprint =
      await this.sprintModel
        .findById(id)
        .populate('projectId');

    if (!sprint) {
      throw new NotFoundException(
        'Sprint not found',
      );
    }

    return sprint;
  }

  async update(
    id: string,
    updateSprintDto: UpdateSprintDto,
  ) {
    const sprint =
      await this.sprintModel.findByIdAndUpdate(
        id,
        updateSprintDto,
        {
          returnDocument: 'after',
        },
      );

    if (!sprint) {
      throw new NotFoundException(
        'Sprint not found',
      );
    }

    return sprint;
  }

  async remove(id: string) {
    const sprint =
      await this.sprintModel.findByIdAndUpdate(
        id,
        {
          isDeleted: true,
        },
        {
          returnDocument: 'after',
        },
      );

    if (!sprint) {
      throw new NotFoundException(
        'Sprint not found',
      );
    }

    return {
      success: true,
      message:
        'Sprint deleted successfully',
    };
  }

  async search(
    query: SearchSprintDto,
  ) {
    const {
      keyword,
      projectId,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {
      isDeleted: false,
    };

    if (keyword) {
      filter.$or = [
        {
          sprintId: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          name: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          goal: {
            $regex: keyword,
            $options: 'i',
          },
        },
      ];
    }

    if (projectId) {
      filter.projectId = projectId;
    }

    if (status) {
      filter.status = status;
    }

    const currentPage =
      Number(page);

    const pageSize =
      Number(limit);

    const data =
      await this.sprintModel
        .find(filter)
        .populate('projectId')
        .sort({
          [sortBy]:
            sortOrder === 'asc'
              ? 1
              : -1,
        })
        .skip(
          (currentPage - 1) *
            pageSize,
        )
        .limit(pageSize);

    const total =
      await this.sprintModel.countDocuments(
        filter,
      );

    return {
      success: true,
      total,
      page: currentPage,
      limit: pageSize,
      totalPages: Math.ceil(
        total / pageSize,
      ),
      data,
    };
  }

  async findByProject(
    projectId: string,
  ) {
    return this.sprintModel
      .find({
        projectId: projectId,
        isDeleted: false,
      })
      .sort({
        startDate: -1,
      })
      .populate('projectId');
  }

  async activateSprint(
    id: string,
  ) {
    const sprint =
      await this.sprintModel.findById(id);

    if (!sprint) {
      throw new NotFoundException(
        'Sprint not found',
      );
    }

    await this.sprintModel.updateMany(
      {
        projectId:
          sprint.projectId,
        status:
          SprintStatus.ACTIVE,
      },
      {
        status:
          SprintStatus.PLANNED,
      },
    );

    sprint.status =
      SprintStatus.ACTIVE;

    await sprint.save();

    return sprint;
  }

  async completeSprint(
    id: string,
  ) {
    const sprint =
      await this.sprintModel.findById(id);

    if (!sprint) {
      throw new NotFoundException(
        'Sprint not found',
      );
    }

    sprint.status =
      SprintStatus.COMPLETED;

    sprint.progressPercentage =
      100;

    await sprint.save();

    return sprint;
  }
}