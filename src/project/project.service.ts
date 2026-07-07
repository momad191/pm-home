import {
  Injectable,
  NotFoundException,
  // ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';

import { Project, ProjectDocument } from './schemas/project.schema';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { SearchProjectDto } from './dto/search-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
  ) {}

  async create(dto: CreateProjectDto) {
    // const exists =
    //   await this.projectModel.findOne({
    //     projectId: dto.projectId,
    //   });

    // if (exists) {
    //   throw new ConflictException(
    //     'Project already exists',
    //   );
    // }

    return this.projectModel.create(dto);
  }

  async findAll() {
    return this.projectModel.find({ isDeleted: false }).sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const project = await this.projectModel.findById(id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    const project = await this.projectModel.findByIdAndUpdate(id, dto, {
      returnDocument: 'after',
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  // async remove(id: string) {
  //   return this.projectModel.findByIdAndUpdate(
  //     id,
  //     { isDeleted: true },
  //     { returnDocument: 'after' },
  //   );
  // }
  async remove(id: string): Promise<{ message: string }> {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid product ID');
    const deleted = await this.projectModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('project not found');
    return { message: `project ${id} deleted` };
  }

  async search(query: SearchProjectDto) {
    const {
      keyword,
      // projectId,
      name,
      managerId,
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
          name: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          projectId: {
            $regex: keyword,
            $options: 'i',
          },
        },
      ];
    }

    // if (projectId) filter.projectId = projectId;
    if (name) filter.name = name;
    if (managerId) filter.managerId = managerId;
    if (status) filter.status = status;

    const data = await this.projectModel
      .find(filter)
      .sort({
        [sortBy]: sortOrder === 'asc' ? 1 : -1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await this.projectModel.countDocuments(filter);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
