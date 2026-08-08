import { Body, Controller, Get, Post } from '@nestjs/common';

import { ChatbotService } from './chatbot.service';

import { ChatDto } from './dto/chat.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  /**
   * ------------------------------------
   * Chat with AI Agent
   * POST /chatbot/chat
   * ------------------------------------
   */
  @Post('chat')
  async chat(
    @Body()
    chatDto: ChatDto,
  ) {
    return this.chatbotService.chat(chatDto);
  }

  /**
   * ------------------------------------
   * Health Check
   * GET /chatbot/health
   * ------------------------------------
   */
  @Get('health')
  async health() {
    return this.chatbotService.health();
  }

  /**
   * ------------------------------------
   * AI Service Information
   * GET /chatbot/info
   * ------------------------------------
   */
  @Get('info')
  async info() {
    return this.chatbotService.info();
  }
}
