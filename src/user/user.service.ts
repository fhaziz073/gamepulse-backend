import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'node:crypto';
import { Preference } from 'src/entity/preference.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Preference)
    private preferenceRepository: Repository<Preference>,
  ) {}
  async getUserFromDB(userId: string): Promise<User | null> {
    try {
      const result = await this.usersRepository.findOneBy({ username: userId });
      return result;
    } catch {
      console.log("Can't connect to database");
    }
    return null;
  }
  async createUser(userInfo: {
    username: string;
    email: string;
    avatarUrl: string;
    password: string;
    notificationToken: string;
  }) {
    const preference = await this.preferenceRepository.save({
      gameStartNotifPref: false,
      ongoingGameNotifPref: false,
      favTeams: [],
      favPlayers: [],
    });
    await this.usersRepository.save({
      username: userInfo.username,
      email: userInfo.email,
      avatarUrl: userInfo.avatarUrl,
      creationTime: new Date(),
      password: userInfo.password,
      notificationToken: userInfo.notificationToken,
      preference,
    });
  }

  async setUsername(id: string, newUsername: string): Promise<void> {
    try {
      await this.usersRepository.update({ id }, { username: newUsername });
    } catch {
      console.log('Failed Username Update Operation');
    }
  }

  async setPassword(id: string, newPassword: string): Promise<void> {
    try {
      await this.usersRepository.update({ id }, { password: newPassword });
    } catch {
      console.log('Failed Username Password Operation');
    }
  }

  async setEmail(id: string, newEmail: string): Promise<void> {
    try {
      await this.usersRepository.update({ id }, { email: newEmail });
    } catch {
      console.log('Failed Email Update Operation');
    }
  }

  async setAvatarUrl(id: string, newUrl: string): Promise<void> {
    try {
      await this.usersRepository.update({ id }, { avatarUrl: newUrl });
    } catch {
      console.log('Failed Avatar Url Update Operation');
    }
  }
  async getPrefID(userId: string) {
    const result = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { preference: true },
    });
    return result?.preference.id ?? null;
  }
  async logIn(username: string, password: string): Promise<User | null> {
    try {
      const result = this.usersRepository.findOneBy({ username, password });
      return result;
    } catch {
      console.log('Failed Log In Operation');
    }
    return null;
  }

  async upsertPreferenceTable(pref: Partial<Preference>) {
    try {
      await this.preferenceRepository.upsert(pref, ['id']);
    } catch (e) {
      console.log(e);
      console.log('Failed Preference Tables Update Operation');
    }
  }

  async changeGS(userId: UUID, newBool: boolean) {
    try {
      const prefId = await this.getPrefID(userId);
      if (!prefId) return;
      await this.preferenceRepository.update(
        { id: prefId },
        { gameStartNotifPref: newBool },
      );
    } catch {
      console.log('Failed Games Starting Notif Pref Update Operation');
    }
  }

  async changeOGC(userId: UUID, newBool: boolean) {
    try {
      const prefId = await this.getPrefID(userId);
      if (!prefId) return;
      await this.preferenceRepository.update(
        { id: prefId },
        { ongoingGameNotifPref: newBool },
      );
    } catch {
      console.log('Failed Ongoing Close Games Notif Update Operation');
    }
  }

  async updateFavoriteTeams(userId: UUID, teams: number[]): Promise<void> {
    try {
      const prefId = await this.getPrefID(userId);
      if (!prefId) return;
      await this.preferenceRepository.update(
        { id: prefId },
        { favTeams: teams },
      );
    } catch (e) {
      console.log('Failed Favorite Team Update Operation');
      console.log(e);
    }
  }

  async updateFavoritePlayers(userId: UUID, players: number[]): Promise<void> {
    try {
      const prefId = await this.getPrefID(userId);
      if (!prefId) return;
      await this.preferenceRepository.update(
        { id: prefId },
        { favPlayers: players },
      );
    } catch (e) {
      console.log('Failed Favorite Player Update Operation');
      console.log(e);
    }
  }
  async getUsers() {
    try {
      return this.usersRepository.find({ select: { username: true } });
    } catch {
      console.log("Can't connect to database");
    }
    return null;
  }
}
