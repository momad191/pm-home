import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Report, ReportDocument, ReportType } from './schemas/report.schema';

import { CreateReportDto } from './dto/create-report.dto';

import { UpdateReportDto } from './dto/update-report.dto';

import { SearchReportDto } from './dto/search-report.dto';

import { Project, ProjectDocument } from 'src/project/schemas/project.schema';
import { Task, TaskDocument } from 'src/task/schemas/task.schema';
import { Risk, RiskDocument } from 'src/risk/schemas/risk.schema';
import { Issue, IssueDocument } from 'src/issue/schemas/issue.schema';
import { Team, TeamDocument } from 'src/team/schemas/team.schema';

import { TaskStatus } from 'src/task/schemas/task.schema';

import { RiskStatus, RiskLevel } from 'src/risk/schemas/risk.schema';

import { IssueStatus, IssueSeverity } from 'src/issue/schemas/issue.schema';

import PDFDocument = require('pdfkit');

import { Response } from 'express';

import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name)
    private readonly reportModel: Model<ReportDocument>,
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    @InjectModel(Risk.name)
    private readonly riskModel: Model<RiskDocument>,
    @InjectModel(Issue.name)
    private readonly issueModel: Model<IssueDocument>,
    @InjectModel(Team.name)
    private readonly teamModel: Model<TeamDocument>,
  ) {}

  // generateProjectStatus()
  async generateProjectStatus(dto: CreateReportDto) {
    const project = await this.projectModel.findById(dto.projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const tasks = await this.taskModel.find({
      projectId: dto.projectId,
      companyId: dto.companyId,
      isDeleted: false,
    });

    const risks = await this.riskModel.find({
      projectId: dto.projectId,
      companyId: dto.companyId,
      isDeleted: false,
    });

    const issues = await this.issueModel.find({
      projectId: dto.projectId,
      companyId: dto.companyId,
      isDeleted: false,
    });

    const team = await this.teamModel.find({
      projects: dto.projectId,
      companyId: dto.companyId,
      isDeleted: false,
    });

    const completedTasks = tasks.filter(
      (t) => t.status === TaskStatus.COMPLETED,
    ).length;

    const pendingTasks = tasks.filter(
      (t) => t.status !== TaskStatus.COMPLETED,
    ).length;

    const content = {
      project: {
        id: project._id,
        projectId: project.projectId,
        companyId: project.companyId,
        name: project.name,
        description: project.description,
        department: project.department,
        managerId: project.managerId,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        completionPercentage: project.completionPercentage,
      },

      statistics: {
        totalTasks: tasks.length,
        completedTasks,
        pendingTasks,
        totalRisks: risks.length,
        totalIssues: issues.length,
        totalTeams: team.length,
      },

      generatedAt: new Date(),
    };

    return this.reportModel.create({
      reportType: ReportType.PROJECT_STATUS,

      projectId: dto.projectId,

      companyId: dto.companyId,

      generatedBy: dto.generatedBy,

      title: `${project.name} Project Status Report`,

      description: `Status report for ${project.name}`,

      content,
    });
  }

  // generateRiskReport()
  async generateRiskReport(dto: CreateReportDto) {
    const project = await this.projectModel.findById(dto.projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const companyId = project.companyId;

    const risks = await this.riskModel.find({
      projectId: dto.projectId,
      companyId,
      isDeleted: false,
    });

    const openRisks = risks.filter((r) => r.status === RiskStatus.OPEN).length;

    const inProgressRisks = risks.filter(
      (r) => r.status === RiskStatus.IN_PROGRESS,
    ).length;

    const closedRisks = risks.filter(
      (r) => r.status === RiskStatus.CLOSED,
    ).length;

    const highRisks = risks.filter((r) => r.level === RiskLevel.HIGH).length;

    const mediumRisks = risks.filter(
      (r) => r.level === RiskLevel.MEDIUM,
    ).length;

    const lowRisks = risks.filter((r) => r.level === RiskLevel.LOW).length;

    const content = {
      project: {
        id: project._id,
        companyId: project.companyId,
        projectId: project.projectId,
        name: project.name,
        managerId: project.managerId,
        department: project.department,
        status: project.status,
      },

      statistics: {
        totalRisks: risks.length,

        openRisks,
        inProgressRisks,
        closedRisks,

        highRisks,
        mediumRisks,
        lowRisks,
      },

      risks,

      generatedAt: new Date(),
    };

    return this.reportModel.create({
      companyId,

      reportType: ReportType.RISK_REPORT,

      projectId: dto.projectId,

      generatedBy: dto.generatedBy,

      title: `${project.name} Risk Report`,

      description: `Risk analysis report for ${project.name}`,

      content,
    });
  }

  // generateDelayedTaskReport()
  async generateDelayedTaskReport(dto: CreateReportDto) {
    const project = await this.projectModel.findById(dto.projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const today = new Date();

    const delayedTasks = await this.taskModel.find({
      projectId: dto.projectId,
      companyId: dto.companyId,
      isDeleted: false,
      dueDate: {
        $lt: today,
      },
      status: {
        $ne: TaskStatus.COMPLETED,
      },
    });

    const highPriority = delayedTasks.filter(
      (t) => t.priority === 'HIGH',
    ).length;

    const mediumPriority = delayedTasks.filter(
      (t) => t.priority === 'MEDIUM',
    ).length;

    const lowPriority = delayedTasks.filter((t) => t.priority === 'LOW').length;

    const delayedDays = delayedTasks.map((task) => {
      const diff =
        Math.floor(
          (today.getTime() - new Date(task.dueDate).getTime()) /
            (1000 * 60 * 60 * 24),
        ) || 0;

      return {
        taskId: task._id,
        title: task.title,
        assignedTo: task.assignedTo,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        delayedDays: diff,
      };
    });

    const content = {
      project: {
        id: project._id,
        companyId: project.companyId,
        projectId: project.projectId,
        name: project.name,
        department: project.department,
        managerId: project.managerId,
        status: project.status,
      },

      statistics: {
        totalDelayedTasks: delayedTasks.length,
        highPriority,
        mediumPriority,
        lowPriority,
      },

      delayedTasks: delayedDays,

      generatedAt: new Date(),
    };

    return this.reportModel.create({
      companyId: dto.companyId,

      reportType: ReportType.DELAY_REPORT,

      projectId: dto.projectId,

      generatedBy: dto.generatedBy,

      title: `${project.name} Delayed Tasks Report`,

      content,
    });
  }

  // generateTeamPerformance()
  async generateTeamPerformance(dto: CreateReportDto) {
    if (!dto.projectId) {
      throw new NotFoundException(
        'projectId is required to generate a team performance report',
      );
    }

    // -----------------------------------------
    // Find project
    // -----------------------------------------
    const project = await this.projectModel.findById(dto.projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // -----------------------------------------
    // Find teams working on this project
    // -----------------------------------------
    const teams = await this.teamModel.find({
      projects: dto.projectId,
      companyId: dto.companyId,
      isDeleted: false,
    });

    if (!teams.length) {
      throw new NotFoundException('No teams found for this project');
    }

    // -----------------------------------------
    // Get all project tasks
    // -----------------------------------------
    const tasks = await this.taskModel.find({
      projectId: dto.projectId,
      companyId: dto.companyId,
      isDeleted: false,
    });

    // -----------------------------------------
    // Build team performance
    // -----------------------------------------
    const teamPerformance = teams.map((team) => {
      const memberIds = (team.members || []).map((member: any) =>
        member.toString(),
      );

      // Include team lead as a member for performance calculation
      const allMemberIds = [
        ...new Set([...memberIds, team.teamLead?.toString()].filter(Boolean)),
      ];

      // Tasks assigned to members of this team
      const teamTasks = tasks.filter((task: any) =>
        allMemberIds.includes(task.assignedTo?.toString()),
      );

      const completedTasks = teamTasks.filter(
        (task: any) => task.status === TaskStatus.COMPLETED,
      );

      const pendingTasks = teamTasks.filter(
        (task: any) => task.status !== TaskStatus.COMPLETED,
      );

      // Calculate completion percentage
      const completionPercentage =
        teamTasks.length > 0
          ? Math.round((completedTasks.length / teamTasks.length) * 100)
          : 0;

      // Average task completion percentage
      const averageTaskCompletion =
        teamTasks.length > 0
          ? Math.round(
              teamTasks.reduce(
                (total: number, task: any) =>
                  total + (task.completionPercentage || 0),
                0,
              ) / teamTasks.length,
            )
          : 0;

      return {
        teamId: team._id,
        teamName: team.name,
        teamLead: team.teamLead,

        totalMembers: allMemberIds.length,

        totalTasks: teamTasks.length,

        completedTasks: completedTasks.length,

        pendingTasks: pendingTasks.length,

        completionPercentage,

        averageTaskCompletion,

        performanceStatus:
          completionPercentage >= 80
            ? 'EXCELLENT'
            : completionPercentage >= 60
              ? 'GOOD'
              : completionPercentage >= 40
                ? 'AVERAGE'
                : 'NEEDS_ATTENTION',
      };
    });

    // -----------------------------------------
    // Overall statistics
    // -----------------------------------------
    const totalTeams = teams.length;

    const totalTasks = teamPerformance.reduce(
      (total, team) => total + team.totalTasks,
      0,
    );

    const completedTasks = teamPerformance.reduce(
      (total, team) => total + team.completedTasks,
      0,
    );

    const pendingTasks = teamPerformance.reduce(
      (total, team) => total + team.pendingTasks,
      0,
    );

    const overallCompletionPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // -----------------------------------------
    // Report content
    // -----------------------------------------
    const content = {
      project: {
        id: project._id,
        projectId: project.projectId,
        companyId: project.companyId,
        name: project.name,
        description: project.description,
        department: project.department,
        managerId: project.managerId,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        completionPercentage: project.completionPercentage,
      },

      statistics: {
        totalTeams,
        totalTasks,
        completedTasks,
        pendingTasks,
        overallCompletionPercentage,
      },

      teams: teamPerformance,

      generatedAt: new Date(),
    };

    // -----------------------------------------
    // Save report
    // -----------------------------------------
    return this.reportModel.create({
      companyId: dto.companyId,

      reportType: ReportType.TEAM_PERFORMANCE,

      projectId: dto.projectId,

      generatedBy: dto.generatedBy,

      title: `${project.name} Team Performance Report`,

      content,
    });
  }

  // generateIssueReport()
  // generateIssueReport()
  async generateIssueReport(dto: CreateReportDto) {
    if (!dto.projectId) {
      throw new NotFoundException(
        'projectId is required to generate an issue report',
      );
    }

    // -----------------------------------------
    // Find project
    // -----------------------------------------
    const project = await this.projectModel.findOne({
      _id: dto.projectId,
      companyId: dto.companyId,
      isDeleted: false,
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // -----------------------------------------
    // Find project issues
    // -----------------------------------------
    const issues = await this.issueModel.find({
      projectId: dto.projectId,
      companyId: dto.companyId,
      isDeleted: false,
    });

    // -----------------------------------------
    // Status statistics
    // -----------------------------------------
    const openIssues = issues.filter(
      (issue) => issue.status === IssueStatus.OPEN,
    ).length;

    const inProgressIssues = issues.filter(
      (issue) => issue.status === IssueStatus.IN_PROGRESS,
    ).length;

    const resolvedIssues = issues.filter(
      (issue) => issue.status === IssueStatus.RESOLVED,
    ).length;

    const closedIssues = issues.filter(
      (issue) => issue.status === IssueStatus.CLOSED,
    ).length;

    // -----------------------------------------
    // Severity statistics
    // -----------------------------------------
    const lowSeverityIssues = issues.filter(
      (issue) => issue.severity === IssueSeverity.LOW,
    ).length;

    const mediumSeverityIssues = issues.filter(
      (issue) => issue.severity === IssueSeverity.MEDIUM,
    ).length;

    const highSeverityIssues = issues.filter(
      (issue) => issue.severity === IssueSeverity.HIGH,
    ).length;

    const criticalIssues = issues.filter(
      (issue) => issue.severity === IssueSeverity.CRITICAL,
    ).length;

    // -----------------------------------------
    // Resolution percentage
    // -----------------------------------------
    const resolvedPercentage =
      issues.length > 0
        ? Math.round(((resolvedIssues + closedIssues) / issues.length) * 100)
        : 0;

    // -----------------------------------------
    // Issue details
    // -----------------------------------------
    const issueDetails = issues.map((issue) => ({
      id: issue._id,

      issueId: issue.issueId,

      projectId: issue.projectId,

      taskId: issue.taskId,

      companyId: issue.companyId,

      description: issue.description,

      status: issue.status,

      severity: issue.severity,

      assignedTo: issue.assignedTo,

      reportedBy: issue.reportedBy,

      resolvedAt: issue.resolvedAt,

      closedAt: issue.closedAt,

      resolutionNotes: issue.resolutionNotes,

      // createdAt: issue.createdAt,

      // updatedAt: issue.updatedAt,
    }));

    // -----------------------------------------
    // Report content
    // -----------------------------------------
    const content = {
      project: {
        id: project._id,

        projectId: project.projectId,

        companyId: project.companyId,

        name: project.name,

        description: project.description,

        department: project.department,

        managerId: project.managerId,

        status: project.status,

        startDate: project.startDate,

        endDate: project.endDate,

        completionPercentage: project.completionPercentage,
      },

      statistics: {
        totalIssues: issues.length,

        openIssues,

        inProgressIssues,

        resolvedIssues,

        closedIssues,

        resolvedPercentage,

        lowSeverityIssues,

        mediumSeverityIssues,

        highSeverityIssues,

        criticalIssues,
      },

      issues: issueDetails,

      generatedAt: new Date(),
    };

    // -----------------------------------------
    // Save report
    // -----------------------------------------
    return this.reportModel.create({
      companyId: dto.companyId,

      reportType: ReportType.ISSUE_REPORT,

      projectId: dto.projectId,

      generatedBy: dto.generatedBy,

      title: `${project.name} Issue Report`,

      content,
    });
  }

  // findAll()
  async findAllReports(query: SearchReportDto) {
    const {
      search,
      reportType,
      projectId,
      companyId,
      generatedBy,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const currentPage = Math.max(Number(page) || 1, 1);

    const currentLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const filter: any = {
      isDeleted: false,
    };

    // -----------------------------------------
    // Report Type
    // -----------------------------------------
    if (reportType) {
      filter.reportType = reportType;
    }

    // -----------------------------------------
    // Project
    // -----------------------------------------
    if (projectId) {
      filter.projectId = projectId;
    }

    // -----------------------------------------
    // Company
    // -----------------------------------------
    if (companyId) {
      filter.companyId = companyId;
    }

    // -----------------------------------------
    // Generated By
    // -----------------------------------------
    if (generatedBy) {
      filter.generatedBy = generatedBy;
    }

    // -----------------------------------------
    // Search
    // -----------------------------------------
    if (search?.trim()) {
      const searchTerm = this.escapeRegex(search.trim());

      filter.$or = [
        {
          title: {
            $regex: searchTerm,
            $options: 'i',
          },
        },
        {
          description: {
            $regex: searchTerm,
            $options: 'i',
          },
        },
      ];
    }

    // -----------------------------------------
    // Created Date Range
    // -----------------------------------------
    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);

        end.setHours(23, 59, 59, 999);

        filter.createdAt.$lte = end;
      }
    }

    // -----------------------------------------
    // Sorting
    // -----------------------------------------
    const allowedSortFields = ['createdAt', 'updatedAt', 'reportType', 'title'];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    const safeSortOrder = sortOrder?.toLowerCase() === 'asc' ? 1 : -1;

    // -----------------------------------------
    // Query
    // -----------------------------------------
    const skip = (currentPage - 1) * currentLimit;

    const [data, total] = await Promise.all([
      this.reportModel
        .find(filter)
        .sort({
          [safeSortBy]: safeSortOrder,
        })
        .skip(skip)
        .limit(currentLimit),

      this.reportModel.countDocuments(filter),
    ]);

    // -----------------------------------------
    // Response
    // -----------------------------------------
    return {
      data,
      total,
      page: currentPage,
      limit: currentLimit,
      totalPages: Math.ceil(total / currentLimit),
    };
  }

  escapeRegex(text: string) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  // search()
  async search(query: SearchReportDto) {
    const {
      search,
      reportType,
      projectId,
      companyId,
      generatedBy,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {};

    if (reportType) {
      filter.reportType = reportType;
    }

    if (projectId) {
      filter.projectId = projectId;
    }

    if (companyId) {
      filter.companyId = companyId;
    }

    if (generatedBy) {
      filter.generatedBy = generatedBy;
    }

    if (search?.trim()) {
      filter.$or = [
        {
          title: {
            $regex: search.trim(),
            $options: 'i',
          },
        },
        {
          description: {
            $regex: search.trim(),
            $options: 'i',
          },
        },
      ];
    }

    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        filter.createdAt.$lte = end;
      }
    }

    const data = await this.reportModel
      .find(filter)
      .sort({
        [sortBy]: sortOrder === 'asc' ? 1 : -1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await this.reportModel.countDocuments(filter);

    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  // findOne()
  async findOne(id: string) {
    const report = await this.reportModel.find({
      _id: id,
      isDeleted: false,
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  // delete()
  async deleteOne(id: string) {
    const report = await this.reportModel.findById(id);

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.isDeleted = true;

    await report.save();

    return {
      success: true,
      message: 'Report deleted successfully',
    };
  }

  //regenerate()
  async regenerate(id: string) {
    const report = await this.reportModel.findById(id);

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    /**
     * TODO
     * Call Python AI Service
     *
     * Later you'll replace the TODO with

      const aiReport = await this.httpService.post(
    `${AI_URL}/reports/regenerate`,
    {
        reportId:id
    }
);
     * POST /reports/regenerate
     */

    report.regeneratedAt = new Date();

    await report.save();

    return {
      success: true,
      message: 'Report regenerated successfully',
      report,
    };
  }

  addObjectToPdf(doc: any, content: any) {
    // Implementation for adding object to PDF
    // This is a placeholder - replace with actual PDF content generation logic
    doc.fontSize(10).text(JSON.stringify(content, null, 2), {
      align: 'left',
    });
  }

  private formatPdfKey(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/[_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  private formatPdfValue(value: any): string {
    if (value === null || value === undefined) {
      return '-';
    }

    if (value instanceof Date) {
      return value.toLocaleString();
    }

    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return String(value);
    }

    if (value?._bsontype === 'ObjectId') {
      return value.toString();
    }

    return JSON.stringify(value);
  }

  // downloadPdf()
  async downloadPdf(id: string, res: Response) {
    const report = await this.reportModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
    });

    res.setHeader('Content-Type', 'application/pdf');

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="report-${report._id}.pdf"`,
    );

    doc.pipe(res);

    // ----------------------------------------
    // Report Header
    // ----------------------------------------

    doc
      .fontSize(22)
      .font('Helvetica-Bold')
      .text(report.title || 'Project Management Report', {
        align: 'center',
      });

    doc.moveDown();

    doc
      .fontSize(11)
      .font('Helvetica')
      .text(`Report Type: ${report.reportType}`);

    if (report.projectId) {
      doc.text(`Project ID: ${report.projectId}`);
    }

    if (report.generatedBy) {
      doc.text(`Generated By: ${report.generatedBy}`);
    }

    // doc.text(
    //   `Generated At: ${
    //     report.createdAt
    //       ? new Date(report.createdAt).toLocaleString()
    //       : new Date().toLocaleString()
    //   }`,
    // );

    doc.moveDown();

    // ----------------------------------------
    // Description
    // ----------------------------------------

    if (report.description) {
      doc.fontSize(14).font('Helvetica-Bold').text('Description');

      doc.moveDown(0.5);

      doc.fontSize(11).font('Helvetica').text(report.description);

      doc.moveDown();
    }

    // ----------------------------------------
    // Content
    // ----------------------------------------

    doc.fontSize(14).font('Helvetica-Bold').text('Report Content');

    doc.moveDown(0.5);

    doc
      .fontSize(10)
      .font('Courier')
      .text(JSON.stringify(report.content, null, 2), {
        width: 500,
        lineGap: 3,
      });

    // ----------------------------------------
    // Footer
    // ----------------------------------------

    doc.moveDown(2);

    doc
      .fontSize(9)
      .font('Helvetica')
      .text('Generated by Project Management System', {
        align: 'center',
      });

    doc.end();
  }

  // downloadExcel()
  async downloadExcel(id: string, res: Response) {
    const report = await this.reportModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'Project Management System';
    workbook.lastModifiedBy = 'Project Management System';
    workbook.created = new Date();
    workbook.modified = new Date();

    // =========================================================
    // Report Information Sheet
    // =========================================================

    const reportSheet = workbook.addWorksheet('Report');

    reportSheet.columns = [
      {
        header: 'Field',
        key: 'field',
        width: 30,
      },
      {
        header: 'Value',
        key: 'value',
        width: 80,
      },
    ];

    reportSheet.addRows([
      {
        field: 'Report ID',
        value: report._id?.toString(),
      },
      {
        field: 'Report Type',
        value: report.reportType,
      },
      {
        field: 'Title',
        value: report.title || '',
      },
      {
        field: 'Description',
        value: report.description || '',
      },
      {
        field: 'Project ID',
        value: report.projectId?.toString() || '',
      },
      {
        field: 'Generated By',
        value: report.generatedBy?.toString() || '',
      },
      // {
      //   field: 'Created At',
      //   value: report.createdAt
      //     ? new Date(report.createdAt).toLocaleString()
      //     : '',
      // },
    ]);

    // =========================================================
    // Report Content Sheet
    // =========================================================

    const contentSheet = workbook.addWorksheet('Report Content');

    contentSheet.columns = [
      {
        header: 'Key',
        key: 'key',
        width: 40,
      },
      {
        header: 'Value',
        key: 'value',
        width: 100,
      },
    ];

    const flattenObject = (
      object: Record<string, any>,
      parentKey = '',
    ): Array<{ key: string; value: any }> => {
      const rows: Array<{ key: string; value: any }> = [];

      for (const [key, value] of Object.entries(object)) {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        if (
          value !== null &&
          typeof value === 'object' &&
          !Array.isArray(value) &&
          !(value instanceof Date)
        ) {
          rows.push(...flattenObject(value, fullKey));
        } else {
          let formattedValue = value;

          if (Array.isArray(value)) {
            formattedValue = JSON.stringify(value);
          } else if (value !== null && typeof value === 'object') {
            formattedValue = JSON.stringify(value);
          }

          rows.push({
            key: fullKey,
            value: formattedValue,
          });
        }
      }

      return rows;
    };

    if (report.content) {
      const contentRows = flattenObject(report.content as Record<string, any>);

      contentSheet.addRows(contentRows);
    }

    // =========================================================
    // Styling
    // =========================================================

    for (const sheet of [reportSheet, contentSheet]) {
      const headerRow = sheet.getRow(1);

      headerRow.font = {
        bold: true,
      };

      headerRow.alignment = {
        vertical: 'middle',
      };

      headerRow.height = 25;

      sheet.views = [
        {
          state: 'frozen',
          ySplit: 1,
        },
      ];

      sheet.autoFilter = {
        from: 'A1',
        to: 'B1',
      };

      sheet.eachRow((row) => {
        row.alignment = {
          vertical: 'top',
          wrapText: true,
        };
      });
    }

    // =========================================================
    // HTTP Response
    // =========================================================

    const filename = `report-${report._id}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);

    res.end();
  }
}
