import { Injectable } from '@nestjs/common';
import { User, UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Omit<User, 'Password'> | null> {
    const user = await this.usersService.getUserFromDB(username);
    if (user && user.Password === pass) {
      const { Password, ...result } = user;
      return result;
    }
    return null;
  }
}
