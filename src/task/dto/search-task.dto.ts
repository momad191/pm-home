import {
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchTaskDto {
  @IsOptional()
  keyword?: string;

  @IsOptional()
  projectId?: string;

  @IsOptional()
  sprintId?: string;

  @IsOptional()
  assignedTo?: string;

  @IsOptional()
  priority?: string;

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