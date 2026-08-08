import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';

import { Report, ReportSchema } from './schemas/report.schema';
import { Project, ProjectSchema } from '../project/schemas/project.schema';
import { Task, TaskSchema } from '../task/schemas/task.schema';
import { Risk, RiskSchema } from '../risk/schemas/risk.schema';
import { Issue, IssueSchema } from '../issue/schemas/issue.schema';
import { Team, TeamSchema } from '../team/schemas/team.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    MongooseModule.forFeature([{ name: Risk.name, schema: RiskSchema }]),
    MongooseModule.forFeature([{ name: Issue.name, schema: IssueSchema }]),
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
  ],

  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
