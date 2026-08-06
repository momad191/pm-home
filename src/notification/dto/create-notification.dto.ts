import {
  IsMongoId,
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';

import { NotificationType } from '../schemas/notification.schema';

export class CreateNotificationDto {
  @IsMongoId()
  companyId: string;

  @IsMongoId()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
