import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "@shared/schema";

const databaseUrl = process.env.DATABASE_URL;
const sql = databaseUrl ? neon(databaseUrl) : undefined;

export const db = sql ? drizzle(sql, { schema }) : undefined;

export function getDb() {
  if (!db) {
    throw new Error("DATABASE_URL is required to connect to the database.");
  }
  return db;
}
