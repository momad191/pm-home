import { Injectable, ServiceUnavailableException } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';

import { ConfigService } from '@nestjs/config';

import { firstValueFrom } from 'rxjs';

import { AxiosError } from 'axios';

import { ChatDto } from './dto/chat.dto';

@Injectable()
export class ChatbotService {
  constructor(
    private readonly httpService: HttpService,

    private readonly configService: ConfigService,
  ) {}

  /**
   * -------------------------------------------------
   * Chat With AI Agent
   * -------------------------------------------------
   */
  async chat(chatDto: ChatDto) {
    try {
      const baseUrl = this.configService.get<string>('AI_AGENT_URL');

      const response = await firstValueFrom(
        this.httpService.post(
          `${baseUrl}/chat`,
          {
            question: chatDto.question,
            openai_api_key: chatDto.openai_api_key,
            thread_id: chatDto.thread_id,
          },
          {
            timeout: this.configService.get<number>('AI_AGENT_TIMEOUT', 60000),
          },
        ),
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const err = error as AxiosError;

      throw new ServiceUnavailableException({
        success: false,
        message: 'Unable to communicate with the AI Agent.',
        error: err.response?.data ?? err.message,
      });
    }
  }

  /**
   * -------------------------------------------------
   * AI Health Check
   * -------------------------------------------------
   */
  async health() {
    try {
      const baseUrl = this.configService.get<string>('AI_AGENT_URL');

      const response = await firstValueFrom(
        this.httpService.get(`${baseUrl}/health`, {
          timeout: 5000,
        }),
      );

      return {
        success: true,
        status: 'ONLINE',
        data: response.data,
      };
    } catch {
      return {
        success: false,
        status: 'OFFLINE',
        message: 'AI Agent is unavailable.',
      };
    }
  }

  /**
   * -------------------------------------------------
   * AI Service Information
   * -------------------------------------------------
   */
  async info() {
    try {
      const baseUrl = this.configService.get<string>('AI_AGENT_URL');

      const response = await firstValueFrom(
        this.httpService.get(`${baseUrl}/info`, {
          timeout: 5000,
        }),
      );

      return {
        success: true,
        data: response.data,
      };
    } catch {
      return {
        success: true,
        provider: 'LangGraph',
        endpoint: this.configService.get('AI_AGENT_URL'),
        timeout: this.configService.get('AI_AGENT_TIMEOUT', 60000),
        version: '1.0.0',
      };
    }
  }
}
