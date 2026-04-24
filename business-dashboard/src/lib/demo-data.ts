// Mock data for /demo — used to render the UI without real Google/Anthropic/SQLite.
import type { Contact } from "./types";
import type { CalendarEvent, GmailMessage } from "./google";

const todayAt = (h: number, m: number) => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

export const demoMeetings: CalendarEvent[] = [
  {
    id: "m1",
    summary: "1:1 with Lydia Rosenberg — Consume Media",
    start: todayAt(10, 0),
    end: todayAt(10, 30),
    attendees: [{ email: "lydia@consumemedia.co", name: "Lydia Rosenberg" }],
    location: null,
    hangoutLink: "https://meet.google.com/abc-defg-hij",
    description: null,
  },
  {
    id: "m2",
    summary: "Discovery call — TechStars cohort lead",
    start: todayAt(13, 30),
    end: todayAt(14, 0),
    attendees: [
      { email: "marcus@techstars.com", name: "Marcus Chen" },
      { email: "amy@techstars.com", name: "Amy Li" },
    ],
    location: null,
    hangoutLink: "https://meet.google.com/zzz-yyy-xxx",
    description: null,
  },
  {
    id: "m3",
    summary: "Deep work block — AI infra build",
    start: todayAt(15, 0),
    end: todayAt(17, 0),
    attendees: [],
    location: null,
    hangoutLink: null,
    description: null,
  },
];

export const demoEmails: GmailMessage[] = [
  {
    id: "e1",
    threadId: "t1",
    from: "Lydia Rosenberg",
    fromEmail: "lydia@consumemedia.co",
    subject: "Re: Loved our chat at NYC Founders mixer",
    snippet:
      "Following up on what you mentioned about the AI workflow templates — would love to see a quick demo before our call today.",
    receivedAt: hoursAgo(2),
    unread: true,
    awaitingReply: true,
  },
  {
    id: "e2",
    threadId: "t2",
    from: "Marcus Chen",
    fromEmail: "marcus@techstars.com",
    subject: "Agenda for 1:30 — quick prep",
    snippet:
      "Sending over the cohort metrics. We're particularly interested in how your automations could fit our DPM workflow.",
    receivedAt: hoursAgo(4),
    unread: true,
    awaitingReply: true,
  },
  {
    id: "e3",
    threadId: "t3",
    from: "Sarah Patel",
    fromEmail: "sarah@northstargroup.io",
    subject: "Proposal feedback — tweaks needed",
    snippet:
      "Reviewed with the team. Two changes on scope, otherwise we're a go. Can we sign next week?",
    receivedAt: hoursAgo(8),
    unread: true,
    awaitingReply: true,
  },
  {
    id: "e4",
    threadId: "t4",
    from: "Granola",
    fromEmail: "no-reply@granola.ai",
    subject: "Your meeting notes from this morning",
    snippet:
      "Here's the summary and action items from your 9am with the engineering team.",
    receivedAt: hoursAgo(11),
    unread: false,
    awaitingReply: false,
  },
];

export const demoContacts: Contact[] = [
  {
    id: 1,
    name: "Lydia Rosenberg",
    email: "lydia@consumemedia.co",
    company: "Consume Media",
    role: "Founder",
    source: "NYC Founders mixer · Mar 18",
    notes:
      "Building creator-tools platform. Interested in workflow automation. Mentioned needing help with onboarding flows. Sharp, decisive, asks good questions.",
    pipeline_stage: "in-conversation",
    last_touch_at: daysAgo(5),
    next_action: "Send AI workflow demo",
    next_action_due: daysAgo(0),
    created_at: daysAgo(35),
    updated_at: daysAgo(5),
  },
  {
    id: 2,
    name: "Marcus Chen",
    email: "marcus@techstars.com",
    company: "TechStars",
    role: "Cohort Director",
    source: "Intro from Sarah Patel",
    notes:
      "Runs accelerator cohort. Looking for automation partners for portfolio companies. Could be 5-10 client referrals if we're a good fit.",
    pipeline_stage: "warm",
    last_touch_at: daysAgo(11),
    next_action: "Discovery call today",
    next_action_due: daysAgo(0),
    created_at: daysAgo(20),
    updated_at: daysAgo(11),
  },
  {
    id: 3,
    name: "Priya Krishnan",
    email: "priya@altavc.com",
    company: "Alta Ventures",
    role: "Principal",
    source: "AI infra panel · Feb 22",
    notes:
      "Investor focused on B2B AI. Not raising right now but introduced me to two portfolio companies. Worth keeping warm.",
    pipeline_stage: "warm",
    last_touch_at: daysAgo(28),
    next_action: "Share Q2 progress note",
    next_action_due: null,
    created_at: daysAgo(60),
    updated_at: daysAgo(28),
  },
  {
    id: 4,
    name: "James O'Connor",
    email: "james@bridgepointops.com",
    company: "Bridgepoint Ops",
    role: "COO",
    source: "Cold intro · LinkedIn",
    notes:
      "Mid-market ops consultancy. Asked about white-label automation builds. Slow mover but real budget if we land it.",
    pipeline_stage: "networking",
    last_touch_at: daysAgo(42),
    next_action: "Re-engage with case study",
    next_action_due: daysAgo(-3),
    created_at: daysAgo(50),
    updated_at: daysAgo(42),
  },
  {
    id: 5,
    name: "Anna Reyes",
    email: "anna@anchorlinepr.com",
    company: "Anchorline PR",
    role: "Founder",
    source: "Founders dinner · Jan 30",
    notes:
      "Wants to refer clients but needs to see a polished one-pager first. Said she'd intro to 3 of her PR clients once we send it.",
    pipeline_stage: "in-conversation",
    last_touch_at: daysAgo(18),
    next_action: "Send one-pager",
    next_action_due: daysAgo(-2),
    created_at: daysAgo(80),
    updated_at: daysAgo(18),
  },
];

export const demoBriefing = `# Today's focus

The single highest-leverage thing today: **close the loop with Lydia at 10am**. She's asked to see a workflow demo before the call — sending it now (before the meeting, not after) flips this from a friendly check-in into a working session, and she's the contact most likely to convert this quarter.

# Meetings today

- **10:00 — Lydia Rosenberg (Consume Media).** Send the AI workflow demo *before* the call. Lead with the onboarding flow she mentioned at the mixer. Ask: "what would make this a 'must have' for your team this quarter?"
- **13:30 — Marcus Chen + Amy Li (TechStars).** This is a referral pipeline conversation, not a project pitch. Goal: understand cohort fit criteria, ask if you can present to the cohort. Don't over-sell the build work.
- **15:00–17:00 — Deep work block.** Protect this. AI infra is the bottleneck on every active deal.

# Inbox triage

- **Sarah Patel (Northstar) — proposal tweaks.** Reply today. She said "sign next week" — speed signals seriousness. 2 sentences acknowledging, send revised scope before EOD.
- **Lydia (pre-meeting).** Don't reply in email — bring the demo to the meeting.
- **Marcus (prep).** Quick reply confirming you'll come prepared with the cohort fit angle.

# Follow-ups due

- **Anna Reyes (Anchorline PR)** — 18 days since last touch, one-pager promised. She's gating 3 warm intros on this. *This is the highest unrealized referral value in your pipeline.* Send the one-pager today even if rough.
- **James O'Connor (Bridgepoint)** — 42 days, going dormant. Re-engage with a case study or write him off this quarter.

# Gaps to watch

Pipeline is concentrated: 2 warm/in-conversation contacts (Lydia, Marcus) carry most of the near-term revenue. If either stalls, your Q2 close rate falls off a cliff. Action: every networking event for the next 3 weeks should produce at least 1 net-new "in-conversation" contact, not just business cards.
`;
