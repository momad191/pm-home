import { IsMongoId, IsOptional } from 'class-validator';

export class CreateReportDto {
  @IsMongoId()
  projectId: string;

  @IsMongoId()
  companyId: string;

  @IsMongoId()
  generatedBy: string;
}
