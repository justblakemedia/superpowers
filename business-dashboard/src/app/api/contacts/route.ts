import { NextRequest, NextResponse } from "next/server";
import { getDb, PIPELINE_STAGES } from "@/lib/db";
import type { Contact } from "@/lib/db";
import { writeContactNote } from "@/lib/obsidian";

export async function GET() {
  const rows = getDb()
    .prepare("SELECT * FROM contacts ORDER BY updated_at DESC")
    .all() as Contact[];
  return NextResponse.json({ contacts: rows });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = String(body.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const stage = PIPELINE_STAGES.includes(body.pipeline_stage)
    ? body.pipeline_stage
    : "networking";

  const now = new Date().toISOString();
  const result = getDb()
    .prepare(
      `INSERT INTO contacts
       (name, email, company, role, source, notes, pipeline_stage, last_touch_at, next_action, next_action_due, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      name,
      body.email ?? null,
      body.company ?? null,
      body.role ?? null,
      body.source ?? null,
      body.notes ?? null,
      stage,
      body.last_touch_at ?? null,
      body.next_action ?? null,
      body.next_action_due ?? null,
      now,
      now,
    );

  const contact = getDb()
    .prepare("SELECT * FROM contacts WHERE id = ?")
    .get(result.lastInsertRowid) as Contact;

  writeContactNote(contact);

  return NextResponse.json({ contact });
}
