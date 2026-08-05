import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { ProjectService } from './project.service';

import { ProjectController } from './project.controller';

import { Project, ProjectSchema } from './schemas/project.schema';

import { ProjectCounter, ProjectCounterSchema } from './schemas/counter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: ProjectCounter.name, schema: ProjectCounterSchema },
    ]),
  ],

  controllers: [ProjectController],

  providers: [ProjectService],
})
export class ProjectModule {}
