import {
  IsEnum,
  IsMongoId,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

import { ReportType } from '../schemas/report.schema';

export class SearchReportDto {
  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ReportType)
  reportType?: ReportType;

  @IsOptional()
  @IsMongoId()
  projectId?: string;

  @IsOptional()
  @IsMongoId()
  generatedBy?: string;

  /**
   * Filter reports generated from this date
   * Format: YYYY-MM-DD
   */
  @IsOptional()
  @IsString()
  startDate?: string;

  /**
   * Filter reports generated until this date
   * Format: YYYY-MM-DD
   */
  @IsOptional()
  @IsString()
  endDate?: string;

  /**
   * Pagination
   */
  @IsOptional()
  @IsNumberString()
  page?: number = 1;

  @IsOptional()
  @IsNumberString()
  limit?: number = 10;

  /**
   * Sorting
   */
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
