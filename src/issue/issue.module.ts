import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { Issue, IssueSchema } from './schemas/issue.schema';

import { IssueController } from './issue.controller';

import { IssueService } from './issue.service';

import { IssueCounter, IssueCounterSchema } from './schemas/counter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Issue.name,

        schema: IssueSchema,
      },
      {
        name: IssueCounter.name,
        schema: IssueCounterSchema,
      },
    ]),
  ],

  controllers: [IssueController],

  providers: [IssueService],

  exports: [IssueService],
})
export class IssueModule {}
