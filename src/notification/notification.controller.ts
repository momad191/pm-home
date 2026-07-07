import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { NotificationService } from './notification.service';

import { CreateNotificationDto } from './dto/create-notification.dto';

import { UpdateNotificationDto } from './dto/update-notification.dto';

import { SearchNotificationDto } from './dto/search-notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * ---------------------------------------------------------
   * POST /notification
   * Create Notification
   * ---------------------------------------------------------
   */
  @Post()
  create(
    @Body()
    createNotificationDto: CreateNotificationDto,
  ) {
    return this.notificationService.create(createNotificationDto);
  }

  /**
   * ---------------------------------------------------------
   * GET /notification
   * Get All Notifications
   * ---------------------------------------------------------
   */
  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  /**
   * ---------------------------------------------------------
   * GET /notification/search
   * Search + Filters + Pagination + Sorting
   * ---------------------------------------------------------
   */
  @Get('search')
  search(
    @Query()
    query: SearchNotificationDto,
  ) {
    return this.notificationService.search(query);
  }

  /**
   * ---------------------------------------------------------
   * GET /notification/user/:userId
   * Notifications By User
   * ---------------------------------------------------------
   */

  @Get('user/:userId')
  findByUser(
    @Param('userId') userId: string,

    @Query('page') page = 1,

    @Query('limit') limit = 10,

    @Query('isRead') isRead?: boolean,

    @Query('isArchived') isArchived?: boolean,
  ) {
    return this.notificationService.findByUser(
      userId,
      Number(page),
      Number(limit),
      isRead,
      isArchived,
    );
  }

  /**
   * ---------------------------------------------------------
   * GET /notification/:id
   * Get Notification By Id
   * ---------------------------------------------------------
   */
  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.notificationService.findOne(id);
  }

  /**
   * ---------------------------------------------------------
   * PATCH /notification/:id
   * Update Notification
   * ---------------------------------------------------------
   */
  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  /**
   * ---------------------------------------------------------
   * PATCH /notification/:id/read
   * Mark Notification As Read
   * ---------------------------------------------------------
   */
  @Patch(':id/read')
  markAsRead(
    @Param('id')
    id: string,
  ) {
    return this.notificationService.markAsRead(id);
  }

  /**
   * ---------------------------------------------------------
   * PATCH /notification/user/:userId/read-all
   * Mark All Notifications As Read
   * ---------------------------------------------------------
   */
  @Patch('user/:userId/read-all')
  markAllAsRead(
    @Param('userId')
    userId: string,
  ) {
    return this.notificationService.markAllAsRead(userId);
  }

  /**
   * ---------------------------------------------------------
   * DELETE /notification/:id
   * Soft Delete Notification
   * ---------------------------------------------------------
   */
  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.notificationService.remove(id);
  }
}
