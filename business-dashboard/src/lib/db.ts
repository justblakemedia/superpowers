import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

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

export type Contact = {
  id: number;
  name: string;
  email: string | null;
  company: string | null;
  role: string | null;
  source: string | null;
  notes: string | null;
  pipeline_stage: string;
  last_touch_at: string | null;
  next_action: string | null;
  next_action_due: string | null;
  created_at: string;
  updated_at: string;
};

export type Interaction = {
  id: number;
  contact_id: number;
  kind: "email" | "meeting" | "call" | "note";
  summary: string | null;
  occurred_at: string;
  source_id: string | null;
  created_at: string;
};

export const PIPELINE_STAGES = [
  "networking",
  "warm",
  "in-conversation",
  "proposal",
  "client",
  "dormant",
] as const;
export type PipelineStage = (typeof PIPELINE_STAGES)[number];
