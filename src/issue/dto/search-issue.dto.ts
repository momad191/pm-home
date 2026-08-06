import { IsOptional } from 'class-validator';

export class SearchIssueDto {
  @IsOptional()
  companyId: string;

  @IsOptional()
  keyword?: string;

  @IsOptional()
  projectId?: string;

  @IsOptional()
  taskId?: string;

  @IsOptional()
  assignedTo?: string;

  @IsOptional()
  status?: string;

  @IsOptional()
  severity?: string;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;

  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsOptional()
  sortOrder?: string = 'desc';
}
