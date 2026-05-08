import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UUID } from 'node:crypto';

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
    await this.userService.createUser({
      username: body.username,
      email: body.email,
      avatarUrl: body.avatarUrl,
      password: body.password,
      notificationToken: body.notif_token,
    });
  }
  @Get()
  async getAllUsers() {
    return await this.userService.getUsers();
  }
  @Patch('username')
  async updateUsername(@Body() body: { newUsername: string; userID: string }) {
    await this.userService.setUsername(body.userID, body.newUsername);
  }
  @Patch('password')
  async updatePassword(@Body() body: { userID: string; newPassword: string }) {
    await this.userService.setPassword(body.userID, body.newPassword);
  }
  @Patch('email')
  async updateEmail(@Body() body: { userID: string; newEmail: string }) {
    await this.userService.setEmail(body.userID, body.newEmail);
  }
  @Patch('avatarUrl')
  async updateAvatarUrl(
    @Body() body: { userID: string; newAvatarUrl: string },
  ) {
    await this.userService.setAvatarUrl(body.userID, body.newAvatarUrl);
  }
  @Patch('pref/gs')
  async updatePreferencesGS(@Body() body: { userID: UUID; newGS: boolean }) {
    await this.userService.changeGS(body.userID, body.newGS);
  }
  @Patch('pref/ogc')
  async updatePreferencesOGC(@Body() body: { userID: UUID; newOGC: boolean }) {
    await this.userService.changeOGC(body.userID, body.newOGC);
  }
  @Patch('pref/teams')
  async updateFavoriteTeams(
    @Body() body: { userID: UUID; newTeams: number[] },
  ) {
    await this.userService.updateFavoriteTeams(body.userID, body.newTeams);
  }
  @Patch('pref/players')
  async updateFavoritePlayers(
    @Body() body: { userID: UUID; newPlayers: number[] },
  ) {
    await this.userService.updateFavoritePlayers(body.userID, body.newPlayers);
  }
}
