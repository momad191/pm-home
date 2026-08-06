import { IsString, IsMongoId, IsEnum, IsOptional } from 'class-validator';

import { RiskLevel, RiskStatus } from '../schemas/risk.schema';

export class CreateRiskDto {
  @IsMongoId()
  companyId: string;

  @IsString()
  riskId: string;

  @IsMongoId()
  projectId: string;

  @IsMongoId()
  taskId: string;

  @IsEnum(RiskLevel)
  level: RiskLevel;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  mitigationPlan?: string;

  @IsOptional()
  @IsEnum(RiskStatus)
  status?: RiskStatus;
}
