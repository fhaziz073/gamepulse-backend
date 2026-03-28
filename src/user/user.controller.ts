import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { randomUUID } from 'node:crypto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body() body: { username: string; email: string; avatarUrl: string },
  ) {
    await this.userService.InsertUser({
      'User ID': randomUUID(),
      'Avatar URL': body.avatarUrl,
      Username: body.username,
      Email: body.email,
      'Creation Time': new Date(),
    });
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.userService.logIn(id, '');
  }
}
