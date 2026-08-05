import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { isValidObjectId, Model } from 'mongoose';

import { Task, TaskDocument, TaskStatus } from './schemas/task.schema';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';

import { TaskCounter, TaskCounterDocument } from './schemas/counter.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    @InjectModel(TaskCounter.name)
    private counterModel: Model<TaskCounterDocument>,
  ) {}

  async getNextTaskId(): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      { name: 'taskId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    return counter.seq;
  }

  async create(createTaskDto: CreateTaskDto) {
    const existingTask = await this.taskModel.findOne({
      taskId: createTaskDto.taskId,
      isDeleted: false,
    });

    if (existingTask) {
      throw new ConflictException('Task ID already exists');
    }

    const task = await this.taskModel.create({
      ...createTaskDto,
      taskId: `TASK-${await this.getNextTaskId()}`,
    });

    return task;
  }

  async findAll() {
    return this.taskModel
      .find({
        isDeleted: false,
      })
      .populate('projectId')
      .populate('sprintId')
      .populate('assignedTo', '-password')
      .sort({
        createdAt: -1,
      });
  }

  async findOne(id: string) {
    const task = await this.taskModel
      .findById(id)
      .populate('projectId')
      .populate('sprintId')
      .populate('assignedTo', '-password');

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, {
      returnDocument: 'after',
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  // async remove(id: string) {
  //   const task = await this.taskModel.findByIdAndUpdate(
  //     id,
  //     {
  //       isDeleted: true,
  //     },
  //     {
  //       returnDocument: 'after',
  //     },
  //   );

  //   if (!task) {
  //     throw new NotFoundException('Task not found');
  //   }

  //   return {
  //     success: true,
  //     message: 'Task deleted successfully',
  //   };
  // }

  async remove(id: string): Promise<{ message: string }> {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid task ID');
    const deleted = await this.taskModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('task not found');
    return { message: `task ${id} deleted` };
  }

  async search(query: SearchTaskDto) {
    const {
      keyword,
      projectId,
      sprintId,
      assignedTo,
      priority,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: Record<string, unknown> = {
      isDeleted: false,
    };

    if (keyword) {
      filter.$or = [
        {
          taskId: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          title: {
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

    if (projectId) {
      filter.projectId = projectId;
    }

    if (sprintId) {
      filter.sprintId = sprintId;
    }

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (status) {
      filter.status = status;
    }

    const currentPage = Number(page);

    const pageSize = Number(limit);

    const data = await this.taskModel
      .find(filter)
      .populate('projectId')
      .populate('sprintId')
      .populate('assignedTo', '-password')
      .sort({
        [sortBy]: sortOrder === 'asc' ? 1 : -1,
      })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    const total = await this.taskModel.countDocuments(filter);

    return {
      success: true,
      total,
      page: currentPage,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
      data,
    };
  }

  async findByProject(projectId: string) {
    return this.taskModel
      .find({
        projectId,
        isDeleted: false,
      })
      .populate('projectId')
      .populate('sprintId')
      .populate('assignedTo', '-password')
      .sort({
        createdAt: -1,
      });
  }

  async findBySprint(sprintId: string) {
    return this.taskModel
      .find({
        sprintId,
        isDeleted: false,
      })
      .populate('projectId')
      .populate('sprintId')
      .populate('assignedTo', '-password')
      .sort({
        createdAt: -1,
      });
  }

  async findByUser(userId: string) {
    return this.taskModel
      .find({
        assignedTo: userId,
        isDeleted: false,
      })
      .populate('projectId')
      .populate('sprintId')
      .populate('assignedTo', '-password')
      .sort({
        createdAt: -1,
      });
  }

  async updateStatus(id: string, status: string) {
    const task = await this.taskModel.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.status = status as TaskStatus;

    await task.save();

    return task;
  }
}
