import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { Risk, RiskSchema } from './schemas/risk.schema';

import { RiskController } from './risk.controller';

import { RiskService } from './risk.service';

import { RiskCounter, RiskCounterSchema } from './schemas/counter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Risk.name,

        schema: RiskSchema,
      },
      {
        name: RiskCounter.name,
        schema: RiskCounterSchema,
      },
    ]),
  ],

  controllers: [RiskController],

  providers: [RiskService],

  exports: [RiskService],
})
export class RiskModule {}
