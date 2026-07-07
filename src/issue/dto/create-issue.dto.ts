import {
  IsString,
  IsMongoId,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';

import { IssueStatus } from '../schemas/issue.schema';

import { IssueSeverity } from '../schemas/issue.schema';

export class CreateIssueDto {
  @IsString()
  issueId: string;

  @IsMongoId()
  projectId: string;

  @IsMongoId()
  taskId: string;

  @IsString()
  description: string;

  @IsMongoId()
  assignedTo: string;

  @IsOptional()
  @IsEnum(IssueStatus)
  status?: IssueStatus;

  @IsMongoId()
  reportedBy: string;

  @IsOptional()
  @IsDateString()
  resolvedAt?: Date;

  @IsOptional()
  @IsDateString()
  closedAt?: Date;

  @IsOptional()
  @IsString()
  resolutionNotes?: string;

  @IsOptional()
  @IsEnum(IssueSeverity)
  severity?: IssueSeverity;
}
