import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { listTodaysEvents, listRecentInbox } from "@/lib/google";
import { getDb } from "@/lib/db";
import type { Contact } from "@/lib/db";
import { DashboardShell } from "@/components/DashboardShell";
import { MeetingsCard } from "@/components/MeetingsCard";
import { EmailsCard } from "@/components/EmailsCard";
import { FollowUpsCard } from "@/components/FollowUpsCard";
import { BriefingCard } from "@/components/BriefingCard";

export const dynamic = "force-dynamic";

function topFollowUps(): Contact[] {
  const db = getDb();
  const rows = db
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
  return rows;
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");
  const accessToken = (session as any).accessToken as string | undefined;
  if (!accessToken) redirect("/signin");

  const [meetings, emails] = await Promise.all([
    listTodaysEvents(accessToken).catch(() => []),
    listRecentInbox(accessToken, 15).catch(() => []),
  ]);

  const followUps = topFollowUps();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <DashboardShell userName={session.user?.name ?? "there"}>
      <BriefingCard date={today} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MeetingsCard events={meetings} />
        <EmailsCard messages={emails} />
      </div>
      <FollowUpsCard contacts={followUps} />
    </DashboardShell>
  );
}
