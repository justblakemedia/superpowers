import { NextRequest, NextResponse } from "next/server";
import { getDb, PIPELINE_STAGES } from "@/lib/db";
import type { Contact } from "@/lib/db";
import { writeContactNote } from "@/lib/obsidian";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();

  const existing = getDb()
    .prepare("SELECT * FROM contacts WHERE id = ?")
    .get(Number(id)) as Contact | undefined;
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });

  const stage =
    body.pipeline_stage && PIPELINE_STAGES.includes(body.pipeline_stage)
      ? body.pipeline_stage
      : existing.pipeline_stage;

  const updated = {
    name: body.name ?? existing.name,
    email: body.email ?? existing.email,
    company: body.company ?? existing.company,
    role: body.role ?? existing.role,
    source: body.source ?? existing.source,
    notes: body.notes ?? existing.notes,
    pipeline_stage: stage,
    last_touch_at: body.last_touch_at ?? existing.last_touch_at,
    next_action: body.next_action ?? existing.next_action,
    next_action_due: body.next_action_due ?? existing.next_action_due,
  };

  const now = new Date().toISOString();
  getDb()
    .prepare(
      `UPDATE contacts SET
        name = ?, email = ?, company = ?, role = ?, source = ?, notes = ?,
        pipeline_stage = ?, last_touch_at = ?, next_action = ?, next_action_due = ?,
        updated_at = ?
       WHERE id = ?`,
    )
    .run(
      updated.name,
      updated.email,
      updated.company,
      updated.role,
      updated.source,
      updated.notes,
      updated.pipeline_stage,
      updated.last_touch_at,
      updated.next_action,
      updated.next_action_due,
      now,
      Number(id),
    );

  const contact = getDb()
    .prepare("SELECT * FROM contacts WHERE id = ?")
    .get(Number(id)) as Contact;

  writeContactNote(contact);

  return NextResponse.json({ contact });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  getDb().prepare("DELETE FROM contacts WHERE id = ?").run(Number(id));
  return NextResponse.json({ ok: true });
}
