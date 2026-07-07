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

import { RiskService } from './risk.service';

import { CreateRiskDto } from './dto/create-risk.dto';

import { UpdateRiskDto } from './dto/update-risk.dto';

import { SearchRiskDto } from './dto/search-risk.dto';

@Controller('risk')
export class RiskController {
  constructor(
    private readonly riskService: RiskService,
  ) {}

  /**
   * POST /risk
   */
  @Post()
  create(
    @Body()
    createRiskDto: CreateRiskDto,
  ) {
    return this.riskService.create(
      createRiskDto,
    );
  }

  /**
   * GET /risk
   */
  @Get()
  findAll() {
    return this.riskService.findAll();
  }

  /**
   * GET /risk/search
   */
  @Get('search')
  search(
    @Query()
    query: SearchRiskDto,
  ) {
    return this.riskService.search(
      query,
    );
  }

  /**
   * GET /risk/project/:projectId
   */
  @Get('project/:projectId')
  findByProject(
    @Param('projectId')
    projectId: string,
  ) {
    return this.riskService.findByProject(
      projectId,
    );
  }

  /**
   * GET /risk/task/:taskId
   */
  @Get('task/:taskId')
  findByTask(
    @Param('taskId')
    taskId: string,
  ) {
    return this.riskService.findByTask(
      taskId,
    );
  }

  /**
   * GET /risk/:id
   */
  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.riskService.findOne(id);
  }

  /**
   * PATCH /risk/:id
   */
  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    updateRiskDto: UpdateRiskDto,
  ) {
    return this.riskService.update(
      id,
      updateRiskDto,
    );
  }

  /**
   * PATCH /risk/:id/status
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
    return this.riskService.updateStatus(
      id,
      body.status,
    );
  }

  /**
   * DELETE /risk/:id
   */
  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.riskService.remove(id);
  }
}