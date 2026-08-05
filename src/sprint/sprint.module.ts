import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { Sprint, SprintSchema } from './schemas/sprint.schema';

import { SprintService } from './sprint.service';
import { SprintController } from './sprint.controller';

import { SprintCounter, SprintCounterSchema } from './schemas/counter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Sprint.name,
        schema: SprintSchema,
      },
      {
        name: SprintCounter.name,
        schema: SprintCounterSchema,
      },
    ]),
  ],

  controllers: [SprintController],

  providers: [SprintService],

  exports: [SprintService],
})
export class SprintModule {}
