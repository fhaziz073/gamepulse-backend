import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { randomUUID } from 'node:crypto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body()
    body: {
      username: string;
      email: string;
      avatarUrl: string;
      password: string;
      notif_token: string;
    },
  ) {
    await this.userService.upsertUser({
      Username: body.username,
      Email: body.email,
      'Avatar URL': body.avatarUrl,
      'User ID': randomUUID(),
      'Creation Time': new Date(),
      Password: body.password,
      'Notification Token': body.notif_token,
    });
  }
  @Get()
  async getAllUsers() {
    return await this.userService.getUsers();
  }
}
