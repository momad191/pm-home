import { IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchNotificationDto {
  @IsOptional()
  keyword?: string;

  @IsOptional()
  userId?: string;

  @IsOptional()
  companyId?: string;

  @IsOptional()
  type?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isRead?: boolean;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;

  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsOptional()
  sortOrder?: string = 'desc';

  @IsOptional()
  priority?: string;

  @IsOptional()
  referenceType?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isArchived?: boolean;

  @IsOptional()
  expiresAt?: Date;
}
