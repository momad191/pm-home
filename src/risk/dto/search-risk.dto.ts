import {
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchRiskDto {
  @IsOptional()
  keyword?: string;

  @IsOptional()
  projectId?: string;

  @IsOptional()
  taskId?: string;

  @IsOptional()
  level?: string;

  @IsOptional()
  status?: string;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;

  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsOptional()
  sortOrder?: string = 'desc';
}