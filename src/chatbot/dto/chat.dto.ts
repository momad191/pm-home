import { IsNotEmpty, IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  @IsNotEmpty()
  question?: string;

  @IsString()
  @IsNotEmpty()
  openai_api_key?: string;

  @IsString()
  @IsNotEmpty()
  thread_id?: string;
}
