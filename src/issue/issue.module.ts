import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import {
  Issue,
  IssueSchema,
} from './schemas/issue.schema';

import {
  IssueController,
} from './issue.controller';

import {
  IssueService,
} from './issue.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Issue.name,

        schema: IssueSchema,
      },
    ]),
  ],

  controllers: [
    IssueController,
  ],

  providers: [
    IssueService,
  ],

  exports: [
    IssueService,
  ],
})
export class IssueModule {}
