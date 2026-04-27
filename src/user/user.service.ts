import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Preference } from 'src/entity/preference.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Preference)
    private readonly preferenceRepository: Repository<Preference>,
  ) {}

  async getUserFromDB(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('USER_NOT_FOUND');
    return user;
  }

  async getUsers(): Promise<{ username: string }[]> {
    return this.usersRepository.find({
      select: { username: true },
    });
  }

  async logIn(username: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ username });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    return user;
  }

  async createUser(userInfo: {
    username: string;
    email: string;
    avatarUrl: string;
    password: string;
    notificationToken: string;
  }): Promise<User> {
    const preference = await this.preferenceRepository.save({
      gameStartNotifPref: false,
      ongoingGameNotifPref: false,
      favTeams: [],
      favPlayers: [],
    });

    return this.usersRepository.save({
      username: userInfo.username,
      email: userInfo.email,
      avatarUrl: userInfo.avatarUrl,
      password: userInfo.password,
      notificationToken: userInfo.notificationToken,
      creationTime: new Date(),
      preference,
    });
  }

  private async updateField(
    id: string,
    data: Partial<User>,
    errorMsg: string,
  ): Promise<void> {
    try {
      const result = await this.usersRepository.update({ id }, data);

      if (!result.affected) {
        throw new NotFoundException('USER_NOT_FOUND');
      }
    } catch {
      throw new InternalServerErrorException(errorMsg);
    }
  }

  async setUsername(id: string, username: string): Promise<void> {
    return this.updateField(id, { username }, 'USERNAME_UPDATE_FAILED');
  }

  async setPassword(id: string, password: string): Promise<void> {
    return this.updateField(id, { password }, 'PASSWORD_UPDATE_FAILED');
  }

  async setEmail(id: string, email: string): Promise<void> {
    return this.updateField(id, { email }, 'EMAIL_UPDATE_FAILED');
  }

  async setAvatarUrl(id: string, avatarUrl: string): Promise<void> {
    return this.updateField(id, { avatarUrl }, 'AVATAR_UPDATE_FAILED');
  }

  async getPrefID(userId: string): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { preference: true },
    });

    if (!user?.preference?.id) {
      throw new NotFoundException('PREFERENCE_NOT_FOUND');
    }

    return user.preference.id;
  }

  async changeGS(userId: string, value: boolean): Promise<void> {
    const prefId = await this.getPrefID(userId);

    await this.preferenceRepository.update(
      { id: prefId },
      { gameStartNotifPref: value },
    );
  }

  async changeOGC(userId: string, value: boolean): Promise<void> {
    const prefId = await this.getPrefID(userId);

    await this.preferenceRepository.update(
      { id: prefId },
      { ongoingGameNotifPref: value },
    );
  }

  async updateFavoriteTeams(userId: string, teams: string[]): Promise<void> {
    const prefId = await this.getPrefID(userId);

    await this.preferenceRepository.update(
      { id: prefId },
      { favTeams: teams },
    );
  }

  async upsertPreferenceTable(pref: Partial<Preference>): Promise<void> {
    await this.preferenceRepository.upsert(pref, ['id']);
  }
}