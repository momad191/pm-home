import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Delete,
  Res,
} from '@nestjs/common';

import { ReportService } from './report.service';

import { CreateReportDto } from './dto/create-report.dto';
import { SearchReportDto } from './dto/search-report.dto';

import { Response } from 'express';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  /**
   * ------------------------------------
   * Generate Project Status Report
   * POST /report/project-status
   * ------------------------------------
   */
  @Post('project-status')
  generateProjectStatus(
    @Body()
    createReportDto: CreateReportDto,
  ) {
    return this.reportService.generateProjectStatus(createReportDto);
  }

  /**
   * ------------------------------------
   * Generate Risk Report
   * POST /report/risk-report
   * ------------------------------------
   */
  @Post('risk-report')
  generateRiskReport(
    @Body()
    createReportDto: CreateReportDto,
  ) {
    return this.reportService.generateRiskReport(createReportDto);
  }

  /**
   * ------------------------------------
   * Generate Delayed Task Report
   * POST /report/delayed-task-report
   * ------------------------------------
   */
  @Post('delayed-task-report')
  generateDelayedTaskReport(
    @Body()
    createReportDto: CreateReportDto,
  ) {
    return this.reportService.generateDelayedTaskReport(createReportDto);
  }

  /**
   * ------------------------------------
   * Generate Team Performance Report
   * POST /report/team-performance
   * ------------------------------------
   */
  @Post('team-performance')
  generateTeamPerformance(
    @Body()
    createReportDto: CreateReportDto,
  ) {
    return this.reportService.generateTeamPerformance(createReportDto);
  }

  /**
   * ------------------------------------
   * Generate Issue Report
   * POST /report/issue-report
   * ------------------------------------
   */
  @Post('issue-report')
  generateIssueReport(
    @Body()
    createReportDto: CreateReportDto,
  ) {
    return this.reportService.generateIssueReport(createReportDto);
  }

  /**
   * ------------------------------------
   * Get All Reports
   * GET /report
   * ------------------------------------
   */
  @Get()
  findAllReports(
    @Query()
    query: SearchReportDto,
  ) {
    return this.reportService.findAllReports(query);
  }

  /**
   * ------------------------------------
   * Search Reports
   * GET /report/search
   * ------------------------------------
   */
  @Get('search')
  search(
    @Query()
    query: SearchReportDto,
  ) {
    return this.reportService.search(query);
  }

  @Get(':id/download/pdf')
  async downloadPdf(@Param('id') id: string, @Res() res: Response) {
    return this.reportService.downloadPdf(id, res);
  }

  @Get(':id/download/excel')
  async downloadExcel(@Param('id') id: string, @Res() res: Response) {
    return this.reportService.downloadExcel(id, res);
  }

  /**
   * ------------------------------------
   * Get Report By Id
   * GET /report/:id
   * ------------------------------------
   */
  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.reportService.findOne(id);
  }

  @Delete(':id')
  deleteOne(
    @Param('id')
    id: string,
  ) {
    return this.reportService.deleteOne(id);
  }

  @Post(':id/regenerate')
  regenerate(
    @Param('id')
    id: string,
  ) {
    return this.reportService.regenerate(id);
  }
}
