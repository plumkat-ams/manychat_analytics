import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

function createDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  try {
    const client = postgres(connectionString);
    return drizzle(client, { schema });
  } catch {
    return null;
  }
}

const _db = createDb();

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

export const db = _db as DrizzleDb;

export function getDb(): DrizzleDb {
  if (!_db) {
    throw new Error("DATABASE_URL is not configured. Database features are unavailable.");
  }
  return _db;
}

export type Database = DrizzleDb;
