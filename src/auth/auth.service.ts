import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';

import { LoginDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,

    private readonly jwtService: JwtService,
  ) {}

  async login(
    loginDto: LoginDto,
  ) {
    const user =
      await this.userService
        .findByEmail(
          loginDto.email,
        );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const isMatch =
      await bcrypt.compare(
        loginDto.password,
        user.password,
      );

    if (!isMatch) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    const token =
      await this.jwtService.signAsync(
        payload,
      );
 
    return {
      success: true,
      token,
      user: {
        _id: user._id,
        firstName:
          user.firstName,
        lastName:
          user.lastName,
        email: user.email,
        role: user.role,
      },
    };
  }

  async logout() {
    return {
      success: true,
      message:
        'Logged out successfully',
    };
  }
}