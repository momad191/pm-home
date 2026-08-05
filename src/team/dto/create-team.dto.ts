import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

import { TeamStatus } from '../schemas/team.schema';

export class CreateTeamDto {
  @IsString()
  teamId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  department: string;

  @IsMongoId()
  teamLead: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({
    each: true,
  })
  members?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({
    each: true,
  })
  projects?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({
    each: true,
  })
  tasks?: string[];

  @IsOptional()
  @IsEnum(TeamStatus)
  status?: TeamStatus;
}
