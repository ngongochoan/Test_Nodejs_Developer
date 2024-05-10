import { v4 as uuidv4 } from 'uuid';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../../interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { usersDb } from '../../database/user.data';
import { BaseResponse } from 'src/utils/base.response.util';
import { ResponseUserDto } from './dto/response-user.dto';
@Injectable()
export class UserService {
  private readonly users: User[];

  constructor() {
    this.users = usersDb;
  }

  async getAll(): Promise<BaseResponse<Omit<User, 'password'>[]>> {
    const returnUsers = [];
    for (const user of this.users) {
      returnUsers.push(this.sanitizeUserDto(user));
    }
   
    return BaseResponse.success(returnUsers);
  }

  async get(id: string): Promise<BaseResponse<Omit<User, 'password'> | undefined>> {
    const returnUser = this.users.find((user) => user.id === id);

    if (!returnUser) {
      throw new NotFoundException('User not found');
    }

    return BaseResponse.success(returnUser ? this.sanitizeUserDto(returnUser) : returnUser);
  }

  async create(data: CreateUserDto): Promise<BaseResponse<Omit<User, 'password'>>> {
    const user: User = {
      id: uuidv4(),
      ...data,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(user);
    console.log(this.users);
    
    return BaseResponse.success(this.sanitizeUserDto(user));
  }

  async delete(id: string): Promise<BaseResponse<boolean>> {
    const userIdx = this.users.findIndex((user) => user.id === id);
    if (userIdx === -1) {
      throw new NotFoundException('User not found');
    }
    this.users.splice(userIdx, 1);
    return BaseResponse.success(true);
  }

  async updatePassword(
    id: string,
    data: UpdatePasswordDto,
  ): Promise<BaseResponse<Omit<User, 'password'>>> {
    const updatedUser = this.users.find((user) => user.id === id);

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    if (updatedUser.password !== data.oldPassword) {
      throw new ForbiddenException('Wrong password');
    }

    updatedUser.password = data.newPassword;
    updatedUser.version += updatedUser.version;
    updatedUser.updatedAt = Date.now();

    return BaseResponse.success(this.sanitizeUserDto(updatedUser));
  }

  private sanitizeUserDto(user: User): Omit<User, 'password'> {
    const sanitizedUser = { ...user };
    delete sanitizedUser.password;
    return sanitizedUser;
  }
}
