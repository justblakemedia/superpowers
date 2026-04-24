import { google } from "googleapis";

export type CalendarEvent = {
  id: string;
  summary: string;
  start: string | null;
  end: string | null;
  attendees: { email: string; name: string | null }[];
  location: string | null;
  hangoutLink: string | null;
  description: string | null;
};

export type GmailMessage = {
  id: string;
  threadId: string;
  from: string;
  fromEmail: string | null;
  subject: string;
  snippet: string;
  receivedAt: string;
  unread: boolean;
  awaitingReply: boolean;
};

function authClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return auth;
}

export async function listTodaysEvents(
  accessToken: string,
): Promise<CalendarEvent[]> {
  const auth = authClient(accessToken);
  const calendar = google.calendar({ version: "v3", auth });
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 50,
  });

  return (res.data.items ?? []).map((e) => ({
    id: e.id ?? "",
    summary: e.summary ?? "(no title)",
    start: e.start?.dateTime ?? e.start?.date ?? null,
    end: e.end?.dateTime ?? e.end?.date ?? null,
    location: e.location ?? null,
    hangoutLink: e.hangoutLink ?? null,
    description: e.description ?? null,
    attendees: (e.attendees ?? [])
      .filter((a) => !a.self)
      .map((a) => ({ email: a.email ?? "", name: a.displayName ?? null })),
  }));
}

export async function listUpcomingEvents(
  accessToken: string,
  days = 7,
): Promise<CalendarEvent[]> {
  const auth = authClient(accessToken);
  const calendar = google.calendar({ version: "v3", auth });
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + days);

  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 100,
  });

  return (res.data.items ?? []).map((e) => ({
    id: e.id ?? "",
    summary: e.summary ?? "(no title)",
    start: e.start?.dateTime ?? e.start?.date ?? null,
    end: e.end?.dateTime ?? e.end?.date ?? null,
    location: e.location ?? null,
    hangoutLink: e.hangoutLink ?? null,
    description: e.description ?? null,
    attendees: (e.attendees ?? [])
      .filter((a) => !a.self)
      .map((a) => ({ email: a.email ?? "", name: a.displayName ?? null })),
  }));
}

function parseFromHeader(value: string | undefined): {
  display: string;
  email: string | null;
} {
  if (!value) return { display: "", email: null };
  const match = value.match(/^(.*?)<(.+?)>$/);
  if (match)
    return {
      display: match[1].trim().replace(/(^"|"$)/g, ""),
      email: match[2].trim().toLowerCase(),
    };
  return { display: value, email: value.includes("@") ? value.trim().toLowerCase() : null };
}

export async function listRecentInbox(
  accessToken: string,
  maxResults = 20,
): Promise<GmailMessage[]> {
  const auth = authClient(accessToken);
  const gmail = google.gmail({ version: "v1", auth });

  const list = await gmail.users.messages.list({
    userId: "me",
    q: "in:inbox -category:promotions -category:social newer_than:14d",
    maxResults,
  });

  const ids = (list.data.messages ?? []).map((m) => m.id!).filter(Boolean);
  const out: GmailMessage[] = [];

  for (const id of ids) {
    const msg = await gmail.users.messages.get({
      userId: "me",
      id,
      format: "metadata",
      metadataHeaders: ["From", "Subject", "Date"],
    });
    const headers = msg.data.payload?.headers ?? [];
    const fromRaw = headers.find((h) => h.name === "From")?.value;
    const subject = headers.find((h) => h.name === "Subject")?.value ?? "";
    const dateHdr = headers.find((h) => h.name === "Date")?.value ?? "";
    const from = parseFromHeader(fromRaw);
    const labels = msg.data.labelIds ?? [];
    const unread = labels.includes("UNREAD");
    out.push({
      id: msg.data.id ?? id,
      threadId: msg.data.threadId ?? "",
      from: from.display,
      fromEmail: from.email,
      subject,
      snippet: msg.data.snippet ?? "",
      receivedAt: dateHdr ? new Date(dateHdr).toISOString() : new Date().toISOString(),
      unread,
      awaitingReply: unread,
    });
  }
  return out;
}

export async function createGmailDraft(
  accessToken: string,
  to: string,
  subject: string,
  body: string,
): Promise<{ id: string }> {
  const auth = authClient(accessToken);
  const gmail = google.gmail({ version: "v1", auth });

  const raw = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/plain; charset=UTF-8",
    "",
    body,
  ].join("\r\n");

  const encoded = Buffer.from(raw)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await gmail.users.drafts.create({
    userId: "me",
    requestBody: { message: { raw: encoded } },
  });
  return { id: res.data.id ?? "" };
}
