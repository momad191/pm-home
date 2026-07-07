import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { SearchNotificationDto } from './dto/search-notification.dto';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    try {
      // Optional: Validate User Exists
      // Uncomment if UserModel is injected into this service.
      /*
    const user = await this.userModel.findById(
      createNotificationDto.userId,
    );

    if (!user) {
      throw new NotFoundException(
        'User not found.',
      );
    }
    */

      const notification = new this.notificationModel(createNotificationDto);

      const savedNotification = await notification.save();

      const result = await this.notificationModel
        .findById(savedNotification._id)
        .populate('userId');

      return {
        success: true,
        message: 'Notification created successfully.',
        data: result,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      const notifications = await this.notificationModel
        .find({
          isDeleted: false,
        })
        .populate('userId')
        .sort({
          createdAt: -1,
        });

      return {
        success: true,
        message: 'Notifications fetched successfully.',
        total: notifications.length,
        data: notifications,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const notification = await this.notificationModel
        .findOne({
          _id: id,
          isDeleted: false,
        })
        .populate('userId');

      if (!notification) {
        throw new NotFoundException('Notification not found.');
      }

      return {
        success: true,
        message: 'Notification fetched successfully.',
        data: notification,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    try {
      const notification = await this.notificationModel.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!notification) {
        throw new NotFoundException('Notification not found.');
      }

      Object.assign(notification, updateNotificationDto);

      await notification.save();

      return {
        success: true,
        message: 'Notification updated successfully.',
        data: notification,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const notification = await this.notificationModel.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!notification) {
        throw new NotFoundException('Notification not found.');
      }

      notification.isDeleted = true;

      await notification.save();

      return {
        success: true,
        message: 'Notification deleted successfully.',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async search(query: SearchNotificationDto) {
    try {
      const {
        keyword,
        userId,
        type,
        priority,
        isRead,
        isArchived,
        referenceType,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = query;

      const filter: any = {
        isDeleted: false,
      };

      // Keyword Search
      if (keyword) {
        filter.$or = [
          {
            title: {
              $regex: keyword,
              $options: 'i',
            },
          },
          {
            message: {
              $regex: keyword,
              $options: 'i',
            },
          },
        ];
      }

      // Filters
      if (userId) {
        filter.userId = userId;
      }

      if (type) {
        filter.type = type;
      }

      if (priority) {
        filter.priority = priority;
      }

      if (referenceType) {
        filter.referenceType = referenceType;
      }

      if (isRead !== undefined) {
        filter.isRead = isRead;
      }

      if (isArchived !== undefined) {
        filter.isArchived = isArchived;
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [notifications, total] = await Promise.all([
        this.notificationModel
          .find(filter)
          .populate('userId')
          .sort({
            [sortBy]: sortOrder === 'asc' ? 1 : -1,
          })
          .skip(skip)
          .limit(Number(limit)),

        this.notificationModel.countDocuments(filter),
      ]);

      return {
        success: true,

        message: 'Notifications fetched successfully.',

        total,

        page: Number(page),

        limit: Number(limit),

        totalPages: Math.ceil(total / Number(limit)),

        data: notifications,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByUser(
    userId: string,
    page = 1,
    limit = 10,
    isRead?: boolean,
    isArchived?: boolean,
  ) {
    try {
      const filter: any = {
        userId,
        isDeleted: false,
      };

      if (typeof isRead !== 'undefined') {
        filter.isRead = isRead;
      }

      if (typeof isArchived !== 'undefined') {
        filter.isArchived = isArchived;
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [notifications, total] = await Promise.all([
        this.notificationModel
          .find(filter)
          .populate('userId')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit)),

        this.notificationModel.countDocuments(filter),
      ]);

      return {
        success: true,

        message: 'User notifications fetched successfully.',

        total,

        page: Number(page),

        limit: Number(limit),

        totalPages: Math.ceil(total / Number(limit)),

        unreadCount: await this.notificationModel.countDocuments({
          userId,
          isDeleted: false,
          isRead: false,
        }),

        data: notifications,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async markAsRead(id: string) {
    try {
      const notification = await this.notificationModel.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!notification) {
        throw new NotFoundException('Notification not found.');
      }

      if (notification.isRead) {
        return {
          success: true,
          message: 'Notification is already marked as read.',
          data: notification,
        };
      }

      notification.isRead = true;

      await notification.save();

      return {
        success: true,
        message: 'Notification marked as read successfully.',
        data: notification,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async markAllAsRead(userId: string) {
    try {
      const totalNotifications = await this.notificationModel.countDocuments({
        userId,
        isDeleted: false,
      });

      if (totalNotifications === 0) {
        throw new NotFoundException('No notifications found for this user.');
      }

      const result = await this.notificationModel.updateMany(
        {
          userId,
          isDeleted: false,
          isRead: false,
        },
        {
          $set: {
            isRead: true,
          },
        },
      );

      return {
        success: true,
        message: 'All notifications marked as read successfully.',
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
