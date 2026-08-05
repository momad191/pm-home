import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { SprintModule } from './sprint/sprint.module';
import { TaskModule } from './task/task.module';
import { RiskModule } from './risk/risk.module';
import { IssueModule } from './issue/issue.module';
import { NotificationModule } from './notification/notification.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TeamModule } from './team/team.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    UserModule,
    AuthModule,
    ProjectModule,
    SprintModule,
    TaskModule,
    RiskModule,
    IssueModule,
    NotificationModule,
    DashboardModule,
    TeamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
