import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';

import { MongooseModule } from '@nestjs/mongoose';

import { Team, TeamSchema } from './schemas/team.schema';

import { TeamCounter, TeamCounterSchema } from './schemas/counter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Team.name,
        schema: TeamSchema,
      },
      {
        name: TeamCounter.name,
        schema: TeamCounterSchema,
      },
    ]),
  ],

  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
