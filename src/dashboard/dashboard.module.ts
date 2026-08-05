import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Project, ProjectSchema } from '../project/schemas/project.schema';
import { Sprint, SprintSchema } from '../sprint/schemas/sprint.schema';
import { Task, TaskSchema } from '../task/schemas/task.schema';
import { Risk, RiskSchema } from '../risk/schemas/risk.schema';
import { Issue, IssueSchema } from '../issue/schemas/issue.schema';
import {
  Notification,
  NotificationSchema,
} from '../notification/schemas/notification.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },

      {
        name: Project.name,
        schema: ProjectSchema,
      },

      {
        name: Sprint.name,
        schema: SprintSchema,
      },

      {
        name: Task.name,
        schema: TaskSchema,
      },

      {
        name: Risk.name,
        schema: RiskSchema,
      },

      {
        name: Issue.name,
        schema: IssueSchema,
      },

      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
  ],

  controllers: [DashboardController],

  providers: [DashboardService],
})
export class DashboardModule {}
