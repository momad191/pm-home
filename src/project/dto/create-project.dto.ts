import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';

import { ProjectStatus } from '../schemas/project.schema';

export class CreateProjectDto {
//   @IsString()
//   projectId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  managerId: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsEnum(['new', 'in_progress', 'completed'])
  status?: string;

  @IsOptional()
  startDate?: Date;

  @IsOptional()
  endDate?: Date;

  @IsOptional()
  @IsNumber()
  completionPercentage?: number;
}