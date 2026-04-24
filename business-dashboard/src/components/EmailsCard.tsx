import type { GmailMessage } from "@/lib/google";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.round(diff / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function EmailsCard({ messages }: { messages: GmailMessage[] }) {
  const unread = messages.filter((m) => m.unread);
  const list = unread.length > 0 ? unread : messages.slice(0, 8);

  return (
    <section className="rounded-2xl bg-panel border border-edge p-6">
      <h2 className="text-lg font-semibold mb-4">
        Inbox <span className="text-muted text-sm font-normal">({unread.length} unread)</span>
      </h2>
      {list.length === 0 ? (
        <p className="text-muted">Nothing pressing.</p>
      ) : (
        <ul className="space-y-2">
          {list.slice(0, 10).map((m) => (
            <li
              key={m.id}
              className="border border-edge rounded-xl p-3 flex items-start gap-3"
            >
              {m.unread && (
                <span className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-3">
                  <p className="font-medium truncate">{m.from || m.fromEmail}</p>
                  <span className="text-xs text-muted whitespace-nowrap">
                    {relativeTime(m.receivedAt)}
                  </span>
                </div>
                <p className="text-sm truncate">{m.subject || "(no subject)"}</p>
                <p className="text-xs text-muted truncate mt-1">{m.snippet}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
