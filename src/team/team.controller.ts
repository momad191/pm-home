import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { TeamService } from './team.service';

import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { SearchTeamDto } from './dto/search-team.dto';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  /**
   * ------------------------------------
   * Create Team
   * POST /team
   * ------------------------------------
   */
  @Post()
  create(
    @Body()
    createTeamDto: CreateTeamDto,
  ) {
    return this.teamService.create(createTeamDto);
  }

  /**
   * ------------------------------------
   * Get All Teams
   * GET /team
   * ------------------------------------
   */
  @Get()
  findAll() {
    return this.teamService.findAll();
  }

  /**
   * ------------------------------------
   * Search Teams
   * GET /team/search
   * ------------------------------------
   */
  @Get('search')
  search(
    @Query()
    query: SearchTeamDto,
  ) {
    return this.teamService.search(query);
  }

  /**
   * ------------------------------------
   * Get Teams By Team Lead
   * GET /team/lead/:userId
   * ------------------------------------
   */
  @Get('lead/:userId')
  findByLead(
    @Param('userId')
    userId: string,
  ) {
    return this.teamService.findByLead(userId);
  }

  /**
   * ------------------------------------
   * Get Teams By Member
   * GET /team/member/:userId
   * ------------------------------------
   */
  @Get('member/:userId')
  findByMember(
    @Param('userId')
    userId: string,
  ) {
    return this.teamService.findByMember(userId);
  }

  /**
   * ------------------------------------
   * Get Team By Id
   * GET /team/:id
   * ------------------------------------
   */
  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.teamService.findOne(id);
  }

  /**
   * ------------------------------------
   * Update Team
   * PATCH /team/:id
   * ------------------------------------
   */
  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamService.update(id, updateTeamDto);
  }

  /**
   * ------------------------------------
   * Add Member
   * PATCH /team/:id/add-member
   * ------------------------------------
   */
  @Patch(':id/add-member')
  addMember(
    @Param('id')
    id: string,

    @Body('userId')
    userId: string,
  ) {
    return this.teamService.addMember(id, userId);
  }

  /**
   * ------------------------------------
   * Remove Member
   * PATCH /team/:id/remove-member
   * ------------------------------------
   */
  @Patch(':id/remove-member')
  removeMember(
    @Param('id')
    id: string,

    @Body('userId')
    userId: string,
  ) {
    return this.teamService.removeMember(id, userId);
  }

  /**
   * ------------------------------------
   * Change Team Lead
   * PATCH /team/:id/change-lead
   * ------------------------------------
   */
  @Patch(':id/change-lead')
  changeLead(
    @Param('id')
    id: string,

    @Body('teamLead')
    teamLead: string,
  ) {
    return this.teamService.changeLead(id, teamLead);
  }

  /**
   * ------------------------------------
   * Change Team Status
   * PATCH /team/:id/status
   * ------------------------------------
   */
  @Patch(':id/status')
  changeStatus(
    @Param('id')
    id: string,

    @Body('status')
    status: string,
  ) {
    return this.teamService.changeStatus(id, status);
  }

  /**
   * ------------------------------------
   * Soft Delete Team
   * DELETE /team/:id
   * ------------------------------------
   */
  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.teamService.remove(id);
  }
}
