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

import { IssueService } from './issue.service';

import { CreateIssueDto } from './dto/create-issue.dto';

import { UpdateIssueDto } from './dto/update-issue.dto';

import { SearchIssueDto } from './dto/search-issue.dto';

@Controller('issue')
export class IssueController {
  constructor(
    private readonly issueService: IssueService,
  ) {}

  @Post()
  create(
    @Body()
    createIssueDto: CreateIssueDto,
  ) {
    return this.issueService.create(
      createIssueDto,
    );
  }

  @Get()
  findAll() {
    return this.issueService.findAll();
  }

  @Get('search')
  search(
    @Query()
    query: SearchIssueDto,
  ) {
    return this.issueService.search(
      query,
    );
  }

  @Get('project/:projectId')
  findByProject(
    @Param('projectId')
    projectId: string,
  ) {
    return this.issueService.findByProject(
      projectId,
    );
  }

  @Get('task/:taskId')
  findByTask(
    @Param('taskId')
    taskId: string,
  ) {
    return this.issueService.findByTask(
      taskId,
    );
  }

  @Get('user/:userId')
  findByUser(
    @Param('userId')
    userId: string,
  ) {
    return this.issueService.findByUser(
      userId,
    );
  }

  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.issueService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    updateIssueDto: UpdateIssueDto,
  ) {
    return this.issueService.update(
      id,
      updateIssueDto,
    );
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id')
    id: string,

    @Body()
    body: {
      status: string;
    },
  ) {
    return this.issueService.updateStatus(
      id,
      body.status,
    );
  }

  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.issueService.remove(id);
  }
}