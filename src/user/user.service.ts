import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import {
  User,
  UserDocument,
} from './schemas/user.schema';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUserDto } from './dto/search-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) { }

  async create(
    createUserDto: CreateUserDto,
  ) {
    const existingUser =
      await this.userModel.findOne({
        email: createUserDto.email,
      });

    if (existingUser) {
      throw new ConflictException(
        'Email already exists',
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        createUserDto.password,
        10,
      );

    const user =
      await this.userModel.create({
        ...createUserDto,
        password: hashedPassword,
      });

    const { password, ...userObject } =
      user.toObject();

    return userObject;
  }

  async findAll() {
    return this.userModel
      .find({
        isDeleted: false,
      })
      .sort({
        createdAt: -1,
      });
  }

  async findOne(id: string) {
    const user =
      await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ) {
    if (updateUserDto.password) {
      updateUserDto.password =
        await bcrypt.hash(
          updateUserDto.password,
          10,
        );
    }

    const user =
      await this.userModel.findByIdAndUpdate(
        id,
        updateUserDto,
        {
          returnDocument: 'after',
        }
      );

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    const { password: _password, ...userObject } =
      user.toObject();

    return userObject;
  }

  async toggleActive(
    id: string,
  ) {
    const user =
      await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    user.isActive =
      !user.isActive;

    await user.save();

    return user;
  }

  async remove(id: string) {
    const user =
      await this.userModel.findByIdAndUpdate(
        id,
        {
          isDeleted: true,
        },
        {
          new: true,
        },
      );

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    return {
      success: true,
      message:
        'User deleted successfully',
    };
  }

  async search(
    query: SearchUserDto,
  ) {
    const {
      keyword,
      role,
      isActive,
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const currentPage =
      Number(page);

    const pageSize =
      Number(limit);

    const filter: any = {
      isDeleted: false,
    };

    if (keyword) {
      filter.$or = [
        {
          firstName: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          lastName: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: keyword,
            $options: 'i',
          },
        },
      ];
    }

    if (role) {
      filter.role = role;
    }

    if (
      isActive !== undefined
    ) {
      filter.isActive =
        isActive === 'true';
    }

    const users =
      await this.userModel
        .find(filter)
        .sort({
          [sortBy]:
            sortOrder === 'asc'
              ? 1
              : -1,
        })
        .skip(
          (currentPage - 1) *
          pageSize,
        )
        .limit(pageSize);

    const total =
      await this.userModel.countDocuments(
        filter,
      );

    return {
      success: true,
      total,
      page: currentPage,
      limit: pageSize,
      totalPages: Math.ceil(
        total / pageSize,
      ),
      data: users,
    };
  }



  async findByEmail(
    email: string,
  ) {
    return this.userModel
      .findOne({
        email,
        isDeleted: false,
      })
      .select('+password');
  }



}