import { MeetingsCard } from "@/components/MeetingsCard";
import { EmailsCard } from "@/components/EmailsCard";
import { FollowUpsCard } from "@/components/FollowUpsCard";
import { DemoShell } from "./DemoShell";
import { DemoBriefing } from "./DemoBriefing";
import {
  demoMeetings,
  demoEmails,
  demoContacts,
  demoBriefing,
} from "@/lib/demo-data";

export const dynamic = "force-static";

export default function DemoDashboard() {
  return (
    <DemoShell userName="Blake">
      <DemoBriefing body={demoBriefing} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MeetingsCard events={demoMeetings} />
        <EmailsCard messages={demoEmails} />
      </div>
      <FollowUpsCard contacts={demoContacts} />
    </DemoShell>
  );
}
