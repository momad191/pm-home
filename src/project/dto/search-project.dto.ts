import { IsOptional, IsString } from 'class-validator';

export class SearchProjectDto {
  @IsOptional()
  @IsString()
  keyword?: string;

//   @IsOptional()
//   @IsString()
//   projectId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  managerId?: string;

  @IsOptional()
  @IsString()
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