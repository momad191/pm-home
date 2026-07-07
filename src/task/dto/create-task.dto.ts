import {
  IsString,
  IsMongoId,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';

import { TaskPriority, TaskStatus } from '../schemas/task.schema';

export class CreateTaskDto {
  @IsOptional()
  @IsString()
  taskId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsMongoId()
  projectId: string;

  @IsMongoId()
  sprintId: string;

  @IsMongoId()
  assignedTo: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsNumber()
  storyPoints?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsOptional()
  @IsNumber()
  estimatedHours?: number;

  @IsOptional()
  @IsNumber()
  actualHours?: number;
}
