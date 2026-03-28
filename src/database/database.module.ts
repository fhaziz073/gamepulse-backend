import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';
import 'dotenv/config';

export const PG_CONNECTION = 'PG_CONNECTION';
const dbProvider = {
  provide: PG_CONNECTION,
  useValue: new Pool({
    user: 'postgres',
    host: 'localhost',
    password: process.env.POSTGRES_PASSWORD as string,
    port: 5432,
    database: 'gamepulse',
  }),
};

@Global() // This makes the connection available everywhere without re-importing
@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
