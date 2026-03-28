import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
type userInfo = {
  'User ID': string;
  Username: string;
  Email: string;
  'Avatar URL': string;
  'Creation Time': Date;
  'Notification Token': string;
};
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = (await this.authService.validateUser(
      username,
      password,
    )) as userInfo;
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
