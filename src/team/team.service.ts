import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import { Team, TeamDocument } from './schemas/team.schema';

import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { SearchTeamDto } from './dto/search-team.dto';

import { TeamCounter, TeamCounterDocument } from './schemas/counter.schema';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name)
    private readonly teamModel: Model<TeamDocument>,
    @InjectModel(TeamCounter.name)
    private counterModel: Model<TeamCounterDocument>,
  ) {}

  async getNextTeamId(): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      { name: 'teamId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    return counter.seq;
  }

  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async create(dto: CreateTeamDto) {
    const nextTeamId = await this.getNextTeamId();
    return await this.teamModel.create({
      ...dto,
      teamId: `TEAM-${nextTeamId.toString()}`,
    });
  }

  async findAll() {
    return await this.teamModel
      .find({
        isDeleted: false,
      })
      .populate('teamLead')
      .populate('members')
      .populate('projects')
      .populate('tasks')
      .sort({
        createdAt: -1,
      });
  }

  async search(query: SearchTeamDto) {
    const {
      search,
      department,
      teamLead,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {
      isDeleted: false,
    };

    if (search?.trim()) {
      const keyword = this.escapeRegex(search.trim());

      filter.$or = [
        {
          teamId: {
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
          description: {
            $regex: keyword,
            $options: 'i',
          },
        },
      ];
    }

    if (department) {
      filter.department = {
        $regex: department,
        $options: 'i',
      };
    }

    if (teamLead) {
      filter.teamLead = teamLead;
    }

    if (status) {
      filter.status = status;
    }

    const data = await this.teamModel
      .find(filter)
      .populate('teamLead')
      .populate('members')
      .populate('projects')
      .populate('tasks')
      .sort({
        [sortBy]: sortOrder === 'asc' ? 1 : -1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await this.teamModel.countDocuments(filter);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const team = await this.teamModel
      .findOne({
        _id: id,
        isDeleted: false,
      })
      .populate('teamLead')
      .populate('members')
      .populate('projects')
      .populate('tasks');

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  async findByLead(userId: string) {
    return await this.teamModel
      .find({
        teamLead: userId,
        isDeleted: false,
      })
      .populate('members')
      .populate('projects')
      .populate('tasks');
  }

  async findByMember(userId: string) {
    return await this.teamModel
      .find({
        members: userId,
        isDeleted: false,
      })
      .populate('teamLead')
      .populate('projects')
      .populate('tasks');
  }

  async update(id: string, dto: UpdateTeamDto) {
    const team = await this.teamModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      dto,
      {
        returnDocument: 'after',
      },
    );

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  async addMember(id: string, userId: string) {
    const team = await this.teamModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const exists = team.members.some((member) => member.toString() === userId);

    if (exists) {
      throw new BadRequestException('User already exists in this team.');
    }

    team.members.push(new Types.ObjectId(userId));

    await team.save();

    return team.populate('members');
  }

  async removeMember(id: string, userId: string) {
    const team = await this.teamModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    team.members = team.members.filter(
      (member) => member.toString() !== userId,
    );

    await team.save();

    return team.populate('members');
  }

  async changeLead(id: string, teamLead: string) {
    const team = await this.teamModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        teamLead,
      },
      {
        returnDocument: 'after',
      },
    );

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team.populate('teamLead');
  }

  async changeStatus(id: string, status: string) {
    const team = await this.teamModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        status,
      },
      {
        returnDocument: 'after',
      },
    );

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  async remove(id: string) {
    const team = await this.teamModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        isDeleted: true,
      },
      {
        returnDocument: 'after',
      },
    );

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return {
      message: 'Team deleted successfully.',
    };
  }
}
