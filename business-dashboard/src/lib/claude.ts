import Anthropic from "@anthropic-ai/sdk";
import type { Contact, Interaction } from "./db";

let cached: Anthropic | null = null;

function client() {
  if (cached) return cached;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  cached = new Anthropic({ apiKey });
  return cached;
}

const MODEL = "claude-sonnet-4-6";

export async function draftFollowUpEmail(args: {
  contact: Contact;
  recentInteractions: Interaction[];
  userContext: string;
}): Promise<{ subject: string; body: string }> {
  const interactionsText = args.recentInteractions
    .slice(0, 10)
    .map(
      (i) =>
        `- [${i.kind}] ${i.occurred_at}: ${i.summary ?? "(no summary)"}`,
    )
    .join("\n") || "(no recorded interactions yet)";

  const prompt = `You are drafting a follow-up email for the user (a business owner) to send to a networking contact. Write in a warm, specific, low-pressure tone — never salesy. Reference real shared context.

CONTACT
Name: ${args.contact.name}
Email: ${args.contact.email ?? "unknown"}
Company: ${args.contact.company ?? "unknown"}
Role: ${args.contact.role ?? "unknown"}
Source: ${args.contact.source ?? "unknown"}
Pipeline stage: ${args.contact.pipeline_stage}
Last touch: ${args.contact.last_touch_at ?? "never"}
Notes: ${args.contact.notes ?? "(none)"}

RECENT INTERACTIONS
${interactionsText}

USER CONTEXT (about the sender, their business, what they're working on)
${args.userContext || "(none provided)"}

Output a JSON object with two keys: "subject" and "body". Body should be 3-5 short paragraphs, signed off without a name (the user adds their own sign-off).`;

  const res = await client().messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = res.content
    .filter((c) => c.type === "text")
    .map((c) => (c as any).text)
    .join("\n");

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return { subject: `Following up — ${args.contact.name}`, body: text };
  }
  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      subject: String(parsed.subject ?? "Following up"),
      body: String(parsed.body ?? text),
    };
  } catch {
    return { subject: `Following up — ${args.contact.name}`, body: text };
  }
}

export async function generateMorningBriefing(args: {
  todaysMeetings: { summary: string; start: string | null; attendees: string[] }[];
  unreadEmails: { from: string; subject: string; snippet: string }[];
  topFollowUps: { name: string; reason: string }[];
  userContext: string;
}): Promise<string> {
  const prompt = `You are the user's strategic advisor. Write a tight morning briefing in markdown — 5 sections, no fluff.

# Today's focus
(2-3 sentences. What is the single most leveraged thing they should accomplish today, given the data below?)

# Meetings today
(Bulleted list. For each meeting, one line on the prep that matters.)

# Inbox triage
(Bulleted list of emails that actually need a reply today, with one-line guidance.)

# Follow-ups due
(Bulleted list. For each contact, one line on why now and what to say.)

# Gaps to watch
(2-3 sentences on pipeline gaps, dormant relationships, or revenue risks visible in the data.)

DATA
Today's meetings: ${JSON.stringify(args.todaysMeetings)}
Unread emails: ${JSON.stringify(args.unreadEmails)}
Top follow-ups: ${JSON.stringify(args.topFollowUps)}
User context: ${args.userContext || "(none)"}

Be specific. Use real names. No filler.`;

  const res = await client().messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  return res.content
    .filter((c) => c.type === "text")
    .map((c) => (c as any).text)
    .join("\n");
}
