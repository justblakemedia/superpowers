import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import type { Contact } from "@/lib/db";
import { DashboardShell } from "@/components/DashboardShell";
import { ContactsTable } from "@/components/ContactsTable";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  const contacts = getDb()
    .prepare("SELECT * FROM contacts ORDER BY updated_at DESC")
    .all() as Contact[];

  return (
    <DashboardShell userName={session.user?.name ?? "there"}>
      <ContactsTable initial={contacts} />
    </DashboardShell>
  );
}
