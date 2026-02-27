import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Post()
  createUser(
    @Body() body: { username: string; email: string; avatarUrl: string },
  ) {
    return this.userService.createUser(
      body.username,
      body.email,
      body.avatarUrl,
    );
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

}
