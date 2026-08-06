import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';

import { Company, CompanySchema } from './schemas/company.schema';

import { CompanyCounter, CompanyCounterSchema } from './schemas/counter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: CompanyCounter.name, schema: CompanyCounterSchema },
    ]),
  ],

  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
