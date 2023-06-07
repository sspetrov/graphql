import { Injectable, NotFoundException } from '@nestjs/common';
import { UserModel } from './models';
import { v4 } from 'uuid';
import { CreateUserRequest, UpdateUserRequest } from './requests/index.js';

let users: UserModel[] = [];

@Injectable()
export class UsersService {
  getUsers(): UserModel[] {
    return users;
  }

  getUserById(userId: string): UserModel | undefined {
    const user = users.find((user) => user.id === userId);

    if (!user) throw new NotFoundException('User not found');

    return users.find((user) => user.id === userId);
  }

  createUser(request: CreateUserRequest): UserModel {
    const user: UserModel = { id: v4(), ...request };

    users.push(user);

    return user;
  }

  updateUser(request: UpdateUserRequest): UserModel {
    const { id, ...update } = request;

    const user = users.find((user) => user.id === id);

    if (!user) throw new NotFoundException('User not found');

    const updatedUser = { ...user, ...update };

    users = users.map((user) => (user.id === id ? updatedUser : user));

    return updatedUser;
  }
}
