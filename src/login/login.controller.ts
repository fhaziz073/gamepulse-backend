import { Controller, Get, Body } from '@nestjs/common';
import { CreateUserDto } from './bodyDto';
@Controller('login')
export class LoginController {
  constructor() {}
  @Get()
  loginUser(@Body() body: CreateUserDto) {
    const username = body.username;
    //Get user from Advait and Drayton's user route
    //Stopgap solution is doing it manually from controller
    return 1;
  }
}
