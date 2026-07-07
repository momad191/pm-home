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

import { SprintService } from './sprint.service';

import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { SearchSprintDto } from './dto/search-sprint.dto';

@Controller('sprint')
export class SprintController {
  constructor(
    private readonly sprintService: SprintService,
  ) {}

  /**
   * POST /sprint
   */
  @Post()
  create(
    @Body()
    createSprintDto: CreateSprintDto,
  ) {
    return this.sprintService.create(
      createSprintDto,
    );
  }

  /**
   * GET /sprint
   */
  @Get()
  findAll() {
    return this.sprintService.findAll();
  }

  /**
   * GET /sprint/search
   */
  @Get('search')
  search(
    @Query()
    query: SearchSprintDto,
  ) {
    return this.sprintService.search(
      query,
    );
  }

  /**
   * GET /sprint/project/:projectId
   */
  @Get('project/:projectId')
  findByProject(
    @Param('projectId')
    projectId: string,
  ) {
    return this.sprintService.findByProject(
      projectId,
    );
  }

  /**
   * GET /sprint/:id
   */
  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.sprintService.findOne(id);
  }

  /**
   * PATCH /sprint/:id
   */
  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    updateSprintDto: UpdateSprintDto,
  ) {
    return this.sprintService.update(
      id,
      updateSprintDto,
    );
  }

  /**
   * PATCH /sprint/:id/activate
   */
  @Patch(':id/activate')
  activateSprint(
    @Param('id')
    id: string,
  ) {
    return this.sprintService.activateSprint(
      id,
    );
  }

  /**
   * PATCH /sprint/:id/complete
   */
  @Patch(':id/complete')
  completeSprint(
    @Param('id')
    id: string,
  ) {
    return this.sprintService.completeSprint(
      id,
    );
  }

  /**
   * DELETE /sprint/:id
   */
  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.sprintService.remove(id);
  }
}