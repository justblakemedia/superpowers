import "server-only";
import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

export { PIPELINE_STAGES } from "./types";
export type { Contact, Interaction, PipelineStage } from "./types";

let cached: Database.Database | null = null;

export function getDb(): Database.Database {
  if (cached) return cached;

  const dbPath = resolve(process.env.DATABASE_PATH || "./data/dashboard.db");
  const dir = dirname(dbPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  cached = db;
  return db;
}
