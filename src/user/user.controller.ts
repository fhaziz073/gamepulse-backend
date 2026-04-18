import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { randomUUID, UUID } from 'node:crypto';

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
  @Post('pref')
  async createUserPreferences(
    @Body()
    body: {
      userId: UUID;
      gameStartNotifPref: boolean;
      ongoingGameNotifPref: boolean;
      favTeams: UUID[];
      favPlayers: UUID[];
    },
  ) {
    await this.userService.upsertPreferenceTable(
      body.userId,
      body.gameStartNotifPref,
      body.ongoingGameNotifPref,
      body.favTeams,
      body.favPlayers,
    );
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
  async updateFavoriteTeams(@Body() body: { userID: UUID; newTeams: UUID[] }) {
    await this.userService.updateFavoriteTeams(body.userID, body.newTeams);
  }
}
