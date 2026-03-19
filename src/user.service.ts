import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { gpdb } from './gamepulse_database';

@Injectable()
export class UserService {

  async getUserFromDB(userId: number) {
    const result = await gpdb.query(
      `SELECT * FROM "Team Table" WHERE id = $1`,
      [userId]
    );
    return result.rows[0];
  }

  async upsertUser(user: any) {
    const query = `
      INSERT INTO "User Table"
      (User ID, Username, Password, Email, Avatar URL, Creation Time)
      VALUES ($1,$2,$3,$4,$5,$6)
      ON CONFLICT (id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        position = EXCLUDED.position,
        height = EXCLUDED.height,
        weight = EXCLUDED.weight
    `;

    const values = [
      user.UserID,
      user.Username,
      user.Password,
      user.Email,
      user.AvatarURL,
      user.CreationTime,
    ];

    await gpdb.query(query, values);
  }

  async getUserById(userId: number) {
    const existing = await this.getUserFromDB(userId);
    if (existing) {
      return existing;
    } 
    const user;

    await this.upsertUser(user);

    return await this.getUserFromDB(userId);
  }

  async setUsername(id: string, newUsername: string): Promise<void> {
        const query = `
      UPDATE "User Table"
      SET Username = $1
      WHERE id = $2
    `;

    const values = [
      newUsername, id
    ];

    await gpdb.query(query, values);
  }

  async setPassword(id: string, newPassword: string): Promise<void> {
        const query = `
      UPDATE "User Table"
      SET Password = $1
      WHERE id = $2
    `;

    const values = [
      newPassword, id
    ];

    await gpdb.query(query, values);
  }

  async setEmail(id: string, newEmail: string): Promise<void> {
    const query = `
      UPDATE "User Table"
      SET Email = $1
      WHERE id = $2
    `;

    const values = [
      newEmail, id
    ];

    await gpdb.query(query, values);
  }

  async setAvatarUrl(id: string, newUrl: string): Promise<void> {
    const query = `
      UPDATE "User Table"
      SET Avatar URL = $1
      WHERE id = $2
    `;

    const values = [
      newUrl, id
    ];

    await gpdb.query(query, values);
  }

  async logIn(username: string, password: string) {
     const query = `
      SELECT "User ID"
      FROM "User Table"
      WHERE "Username" = $1 AND "Password" = $2
    `;

    const values = [
      username, password
    ];

        await gpdb.query(query, values);
  }

  async upsertPreferenceTable(userId: number) {
    const query = `
      INSERT INTO "Preference Table"
      ("User ID" uuid, "Games Starting Notif Pref" boolean, "Ongoing Close Games Notif Pref" boolean, "Favorite Teams" json, "Favorite Players" json)
      VALUES ($1,$2,$3,$4,$5);
    `
    const values = [
      userId, false, false, null, null
    ];

    await gpdb.query(query, values);
  }

  async changeGS(userId: number, newBool: boolean) {
    const query = 
     ` UPDATE "Preference Table"
       SET "Games Starting Notif Pref" = $1
       WHERE id = $2
    `;
    const values = [
      newBool, userId
    ];

    await gpdb.query(query, values);
  }

  async changeOGC(userId: number, newBool: boolean) {
    const query = 
     ` UPDATE "Preference Table"
       SET "Ongoing Close Games Notif Pref" = $1
       WHERE id = $2
    `;
    const values = [
      newBool, userId
    ];

    await gpdb.query(query, values);
  }


 
}

