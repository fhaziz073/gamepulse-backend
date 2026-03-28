import { Inject, Injectable } from '@nestjs/common';
import { UUID } from 'node:crypto';
import { Pool } from 'pg';
import { PG_CONNECTION } from 'src/database/database.module';
export type User = {
  'User ID': string;
  Username: string;
  Email: string;
  'Avatar URL': string;
  'Creation Time': Date;
  Password: string;
  'Notification Token': string;
};
@Injectable()
export class UserService {
  constructor(@Inject(PG_CONNECTION) private pool: Pool) {}
  async getUserFromDB(userId: UUID): Promise<User | null> {
    try {
      const result = await this.pool.query(
        `SELECT * FROM "User Table" WHERE "User ID" = ${userId}`,
        [userId],
      );
      return result.rows[0] as User;
    } catch {
      console.log("Can't connect to database");
    }
    return null;
  }

  async upsertUser(user: User) {
    const query = `
  INSERT INTO "User Table" 
    ("User ID", "Username", "Email", "Avatar URL", "Creation Time", "Password", "Notification Token")
  VALUES 
    ($1, $2, $3, $4, $5, $6, $7)
  ON CONFLICT ("Username") DO UPDATE SET
    "Email" = EXCLUDED."Email",
    "Avatar URL" = EXCLUDED."Avatar URL";
`;
    const values = [
      user['User ID'],
      user.Username,
      user.Email,
      user['Avatar URL'],
      user['Creation Time'],
      user.Password,
      user['Notification Token'],
    ];
    try {
      await this.pool.query(query, values);
    } catch (error) {
      console.error('Failed Upsert Operation:', error);
    }
  }

  async setUsername(id: UUID, newUsername: string): Promise<void> {
    const query = `
      UPDATE "User Table"
      SET Username = $1
      WHERE "User ID" = $2
    `;

    const values = [newUsername, id];
    try {
      await this.pool.query(query, values);
    } catch {
      console.log('Failed Username Update Operation');
    }
  }

  async setPassword(id: string, newPassword: string): Promise<void> {
    const query = `
      UPDATE "User Table"
      SET Password = $1
      WHERE Username = $2
    `;

    const values = [newPassword, id];

    try {
      await this.pool.query(query, values);
    } catch {
      console.log('Failed Username Password Operation');
    }
  }

  async setEmail(id: string, newEmail: string): Promise<void> {
    const query = `
      UPDATE "User Table"
      SET Email = $1
      WHERE Username = $2
    `;

    const values = [newEmail, id];

    try {
      await this.pool.query(query, values);
    } catch {
      console.log('Failed Email Update Operation');
    }
  }

  async setAvatarUrl(id: string, newUrl: string): Promise<void> {
    const query = `
      UPDATE "User Table"
      SET Avatar URL = $1
      WHERE Username = $2
    `;

    const values = [newUrl, id];

    try {
      await this.pool.query(query, values);
    } catch {
      console.log('Failed Avatar Url Update Operation');
    }
  }

  async logIn(username: string, password: string): Promise<User | null> {
    const query = `
      SELECT "User ID"
      FROM "User Table"
      WHERE "Username" = $1 AND "Password" = $2
    `;

    const values = [username, password];

    try {
      const results = await this.pool.query(query, values);
      return results.rows[0] as User;
    } catch {
      console.log('Failed Log In Operation');
    }
    return null;
  }

  async upsertPreferenceTable(userId: number) {
    const query = `
      INSERT INTO "Preference Table"
      ("User ID" uuid, "Games Starting Notif Pref" boolean, "Ongoing Close Games Notif Pref" boolean, "Favorite Teams" json, "Favorite Players" json)
      VALUES ($1,$2,$3,$4,$5);
    `;
    const values = [userId, false, false, null, null];

    try {
      await this.pool.query(query, values);
    } catch {
      console.log('Failed Preference Tables Update Operation');
    }
  }

  async changeGS(userId: number, newBool: boolean) {
    const query = ` UPDATE "Preference Table"
       SET "Games Starting Notif Pref" = $1
       WHERE id = $2
    `;
    const values = [newBool, userId];

    try {
      await this.pool.query(query, values);
    } catch {
      console.log('Failed Games Starting Notif Pref Update Operation');
    }
  }

  async changeOGC(userId: number, newBool: boolean) {
    const query = ` UPDATE "Preference Table"
       SET "Ongoing Close Games Notif Pref" = $1
       WHERE id = $2
    `;
    const values = [newBool, userId];

    try {
      await this.pool.query(query, values);
    } catch {
      console.log('Failed Ongoing Close Games Notif Update Operation');
    }
  }

  async addFavoriteTeam(userId: number, team: string): Promise<void> {
    const query = `
    UPDATE "Preference Table"
    SET "Favorite Teams" = 
      COALESCE("Favorite Teams", '[]'::jsonb) || to_jsonb($1::text)
    WHERE "User ID" = $2
  `;

    const values = [team, userId];

    try {
      await this.pool.query(query, values);
    } catch {
      console.log('Failed Favorite Team Insert Operation');
    }
  }

  async removeFavoriteTeam(userId: number, team: string): Promise<void> {
    const query = `
    UPDATE "Preference Table"
    SET "Favorite Teams" = (
      SELECT jsonb_agg(value)
      FROM jsonb_array_elements("Favorite Teams"::jsonb) AS value
      WHERE value != to_jsonb($1::text)
    )
    WHERE "User ID" = $2
  `;

    const values = [team, userId];

    try {
      await this.pool.query(query, values);
    } catch {
      console.log('Failed Favorite Team Deletion Operation');
    }
  }
}
