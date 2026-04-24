import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json({ error: "missing date" }, { status: 400 });
  const row = getDb()
    .prepare("SELECT body_md FROM daily_briefings WHERE date = ?")
    .get(date) as { body_md: string } | undefined;
  return NextResponse.json({ body_md: row?.body_md ?? null });
}
