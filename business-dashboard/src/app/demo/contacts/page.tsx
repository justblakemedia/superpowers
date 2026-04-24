import { DemoShell } from "../DemoShell";
import { DemoContactsTable } from "./DemoContactsTable";
import { demoContacts } from "@/lib/demo-data";

export const dynamic = "force-static";

export default function DemoContactsPage() {
  return (
    <DemoShell userName="Blake">
      <DemoContactsTable contacts={demoContacts} />
    </DemoShell>
  );
}
