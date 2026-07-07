import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import {
  Risk,
  RiskSchema,
} from './schemas/risk.schema';

import { RiskController } from './risk.controller';

import { RiskService } from './risk.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Risk.name,

        schema: RiskSchema,
      },
    ]),
  ],


  controllers: [
    RiskController,
  ],

  providers: [
    RiskService,
  ],

  exports: [
    RiskService,
  ],
})
export class RiskModule {}
