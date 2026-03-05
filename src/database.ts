import { Client } from 'pg';
import 'dotenv/config';
const adminConfig = {
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
    } else {
      console.log(`Database "${DB_NAME}" already exists`);
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
