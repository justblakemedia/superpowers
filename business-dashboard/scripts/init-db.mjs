// Initializes the SQLite database with the schema.
// Run with: npm run db:init

import Database from "better-sqlite3";
import { mkdirSync, existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

// Minimal .env.local loader so we don't pull in another dependency.
function loadEnvLocal() {
  try {
    const text = readFileSync(".env.local", "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {
    // No .env.local — fine, fall back to defaults.
  }
}

loadEnvLocal();

const dbPath = resolve(process.env.DATABASE_PATH || "./data/dashboard.db");
const dir = dirname(dbPath);
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    company TEXT,
    role TEXT,
    source TEXT,
    notes TEXT,
    pipeline_stage TEXT DEFAULT 'networking',
    last_touch_at TEXT,
    next_action TEXT,
    next_action_due TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
  CREATE INDEX IF NOT EXISTS idx_contacts_stage ON contacts(pipeline_stage);
  CREATE INDEX IF NOT EXISTS idx_contacts_due ON contacts(next_action_due);

  CREATE TABLE IF NOT EXISTS interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    kind TEXT NOT NULL,
    summary TEXT,
    occurred_at TEXT NOT NULL,
    source_id TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_interactions_contact ON interactions(contact_id);
  CREATE INDEX IF NOT EXISTS idx_interactions_when ON interactions(occurred_at);

  CREATE TABLE IF NOT EXISTS daily_briefings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    body_md TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

console.log(`Initialized database at ${dbPath}`);
db.close();
