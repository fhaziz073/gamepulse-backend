import { Client } from 'pg';
import 'dotenv/config';
import path from 'node:path';
import fs from 'node:fs';
export const adminConfig = {
  user: 'postgres',
  host: 'localhost',
  password: process.env.POSTGRES_PASSWORD as string,
  port: 5432,
  database: 'postgres', // Connect to a default database initially
};

const DB_NAME = 'gamepulse';

export async function createDatabase() {
  const adminClient = new Client(adminConfig);
  try {
    await adminClient.connect();
    console.log('Connected to admin database');

    // Check if database exists and create if not
    const dbCheck = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME],
    );
    if (dbCheck.rowCount === 0) {
      await adminClient.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`Database "${DB_NAME}" created successfully`);
      const schemaFilePath = path.join(process.cwd(), 'gamepulse_database');
      // Filter out COPY blocks before executing
      const schemaSql = fs
        .readFileSync(schemaFilePath, 'utf8')
        .trimStart()
        // Remove COPY ... FROM stdin blocks including the \. terminator
        .replace(/COPY\s[\s\S]*?\\\.(\r?\n|$)/gm, '')
        // Remove SET and SELECT config lines that may also cause issues
        .replace(/^(SET|SELECT pg_catalog\.set_config).+;$/gm, '');
      await adminClient.end();
      const dbClient = new Client({ ...adminConfig, database: DB_NAME });
      await dbClient.connect();
      await dbClient.query(schemaSql);
      const resp = await dbClient.query(`SELECT * FROM public."Player Table";`);
      console.log(resp);
      await dbClient.end();
    } else {
      console.log(`Database "${DB_NAME}" already exists`);
      const dbClient = new Client({ ...adminConfig, database: DB_NAME });
      await dbClient.connect();
      const resp = await dbClient.query(`SELECT * FROM public."Player Table";`);
      console.log(resp);
      await dbClient.end();
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error creating database:', err.message);
    } else {
      console.error('Error creating database:', err);
    }
  } finally {
    await adminClient.end();
  }
}
