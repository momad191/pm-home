import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { TaskService } from './task.service';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /**
   * POST /task
   */
  @Post()
  create(
    @Body()
    createTaskDto: CreateTaskDto,
  ) {
    return this.taskService.create(createTaskDto);
  }

  /**
   * GET /task
   */
  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  /**
   * GET /task/search
   */
  @Get('search')
  search(
    @Query()
    query: SearchTaskDto,
  ) {
    return this.taskService.search(query);
  }

  /**
   * GET /task/project/:projectId
   */
  @Get('project/:projectId')
  findByProject(
    @Param('projectId')
    projectId: string,
  ) {
    return this.taskService.findByProject(projectId);
  }

  /**
   * GET /task/sprint/:sprintId
   */
  @Get('sprint/:sprintId')
  findBySprint(
    @Param('sprintId')
    sprintId: string,
  ) {
    return this.taskService.findBySprint(sprintId);
  }

  /**
   * GET /task/user/:userId
   */
  @Get('user/:userId')
  findByUser(
    @Param('userId')
    userId: string,
  ) {
    return this.taskService.findByUser(userId);
  }

  /**
   * GET /task/:id
   */
  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.taskService.findOne(id);
  }

  /**
   * PATCH /task/:id
   */
  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(id, updateTaskDto);
  }

  /**
   * PATCH /task/:id/status
   */
  @Patch(':id/status')
  updateStatus(
    @Param('id')
    id: string,

    @Body()
    body: {
      status: string;
    },
  ) {
    return this.taskService.updateStatus(id, body.status);
  }

  /**
   * DELETE /task/:id
   */
  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.taskService.remove(id);
  }
}
