import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';
import 'dotenv/config';

export const PG_CONNECTION = 'PG_CONNECTION';

const dbProvider = {
  provide: PG_CONNECTION,
  useFactory: () => {
    // Render provides a DATABASE_URL. If it exists, use it.
    // If not, use your local fallback settings.
    const connectionString = process.env.DATABASE_URL;

    if (connectionString) {
      return new Pool({
        connectionString,
        ssl: {
          rejectUnauthorized: false, // Required for Render/Managed Postgres
        },
      });
    }

    // Local Development Fallback
    return new Pool({
      user: 'postgres',
      host: 'localhost',
      password: process.env.POSTGRES_PASSWORD,
      port: 5432,
      database: 'gamepulse',
    });
  },
};

@Global()
@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
