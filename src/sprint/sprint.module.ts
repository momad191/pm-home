import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import {
  Sprint,
  SprintSchema,
} from './schemas/sprint.schema';

import { SprintService } from './sprint.service';
import { SprintController } from './sprint.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Sprint.name,
        schema: SprintSchema,
      },
    ]),
  ],

  controllers: [
    SprintController,
  ],

  providers: [
    SprintService,
  ],

  exports: [
    SprintService,
  ],
})
export class SprintModule {}
