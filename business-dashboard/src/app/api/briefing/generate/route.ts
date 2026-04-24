import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listTodaysEvents, listRecentInbox } from "@/lib/google";
import { generateMorningBriefing } from "@/lib/claude";
import { writeDailyBriefing } from "@/lib/obsidian";
import { getDb } from "@/lib/db";
import type { Contact } from "@/lib/db";

export async function POST() {
  const session = await getServerSession(authOptions);
  const accessToken = (session as any)?.accessToken as string | undefined;
  if (!accessToken)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const [meetings, emails] = await Promise.all([
    listTodaysEvents(accessToken).catch(() => []),
    listRecentInbox(accessToken, 20).catch(() => []),
  ]);

  const followUps = getDb()
    .prepare(
      `SELECT * FROM contacts
       WHERE pipeline_stage NOT IN ('client', 'dormant')
       ORDER BY
         CASE WHEN next_action_due IS NULL THEN 1 ELSE 0 END,
         next_action_due ASC,
         CASE WHEN last_touch_at IS NULL THEN 0 ELSE 1 END,
         last_touch_at ASC
       LIMIT 5`,
    )
    .all() as Contact[];

  const body_md = await generateMorningBriefing({
    todaysMeetings: meetings.map((m) => ({
      summary: m.summary,
      start: m.start,
      attendees: m.attendees.map((a) => a.name || a.email),
    })),
    unreadEmails: emails
      .filter((e) => e.unread)
      .map((e) => ({ from: e.from, subject: e.subject, snippet: e.snippet })),
    topFollowUps: followUps.map((c) => ({
      name: c.name,
      reason: `last touch ${c.last_touch_at ?? "never"}, stage ${c.pipeline_stage}`,
    })),
    userContext: process.env.USER_CONTEXT ?? "",
  });

  const date = new Date().toISOString().slice(0, 10);
  getDb()
    .prepare(
      `INSERT INTO daily_briefings (date, body_md) VALUES (?, ?)
       ON CONFLICT(date) DO UPDATE SET body_md = excluded.body_md`,
    )
    .run(date, body_md);

  const vaultPath = writeDailyBriefing(date, body_md);

  return NextResponse.json({ body_md, vault_path: vaultPath });
}
