import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { PG_CONNECTION } from 'src/database/database.module';

@Injectable()
export class MigrationService implements OnModuleInit {
  constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

  async onModuleInit() {
    console.log('Running database migrations...');
    await this.runMigrations();
  }

  private async runMigrations() {
    try {
      // 1. Check if the "Player Table" already exists to avoid re-running
      const checkTable = await this.db.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'Player Table'
        );
      `);

      if (checkTable.rows[0].exists) {
        console.log('Database schema already exists. Skipping migration.');
        return;
      }

      // 2. Load your SQL file
      const schemaPath = path.join(process.cwd(), 'gamepulse_database');
      if (!fs.existsSync(schemaPath)) {
        console.warn('Migration file not found at:', schemaPath);
        return;
      }

      let sql = fs.readFileSync(schemaPath, 'utf8');

      // 3. Clean the SQL (same logic you had before)
      sql = sql
        .replace(/COPY\s[\s\S]*?\\\.(\r?\n|$)/gm, '')
        .replace(/^(SET|SELECT pg_catalog\.set_config).+;$/gm, '');

      // 4. Execute
      await this.db.query(sql);
      console.log('Migrations executed successfully!');
    } catch (err) {
      console.error('Migration failed:', err);
    }
  }
}
