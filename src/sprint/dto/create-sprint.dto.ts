import {
  IsString,
  IsMongoId,
  IsDateString,
  IsOptional,
  IsEnum,
} from 'class-validator';

import { SprintStatus } from '../schemas/sprint.schema';

export class CreateSprintDto {
  @IsString()
  sprintId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  goal?: string;

  @IsMongoId()
  projectId: string;

  @IsOptional()
  @IsEnum(SprintStatus)
  status?: SprintStatus;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;
}