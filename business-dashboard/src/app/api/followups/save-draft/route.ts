import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createGmailDraft } from "@/lib/google";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const accessToken = (session as any)?.accessToken as string | undefined;
  if (!accessToken)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { to, subject, body, contact_id } = await req.json();
  if (!to || !subject || !body)
    return NextResponse.json({ error: "missing fields" }, { status: 400 });

  try {
    const result = await createGmailDraft(accessToken, to, subject, body);
    if (contact_id) {
      const now = new Date().toISOString();
      getDb()
        .prepare(
          `INSERT INTO interactions (contact_id, kind, summary, occurred_at, source_id)
           VALUES (?, 'email', ?, ?, ?)`,
        )
        .run(contact_id, `Drafted: ${subject}`, now, result.id);
      getDb()
        .prepare(
          "UPDATE contacts SET last_touch_at = ?, updated_at = ? WHERE id = ?",
        )
        .run(now, now, contact_id);
    }
    return NextResponse.json({ ok: true, draft_id: result.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
