import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Contact, Interaction } from "@/lib/db";
import { draftFollowUpEmail } from "@/lib/claude";

export async function POST(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("contact_id");
  if (!id) return NextResponse.json({ error: "missing contact_id" }, { status: 400 });

  const db = getDb();
  const contact = db
    .prepare("SELECT * FROM contacts WHERE id = ?")
    .get(Number(id)) as Contact | undefined;
  if (!contact) return NextResponse.json({ error: "not found" }, { status: 404 });

  const interactions = db
    .prepare(
      "SELECT * FROM interactions WHERE contact_id = ? ORDER BY occurred_at DESC LIMIT 20",
    )
    .all(contact.id) as Interaction[];

  try {
    const draft = await draftFollowUpEmail({
      contact,
      recentInteractions: interactions,
      userContext: process.env.USER_CONTEXT ?? "",
    });
    return NextResponse.json(draft);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "draft failed" },
      { status: 500 },
    );
  }
}
