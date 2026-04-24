import type { CalendarEvent } from "@/lib/google";

function formatTime(iso: string | null): string {
  if (!iso) return "";
  if (iso.length === 10) return "All day";
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function MeetingsCard({ events }: { events: CalendarEvent[] }) {
  return (
    <section className="rounded-2xl bg-panel border border-edge p-6">
      <h2 className="text-lg font-semibold mb-4">Today's meetings</h2>
      {events.length === 0 ? (
        <p className="text-muted">Nothing scheduled. Use the time.</p>
      ) : (
        <ul className="space-y-3">
          {events.map((e) => (
            <li
              key={e.id}
              className="border border-edge rounded-xl p-4 flex justify-between items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{e.summary}</p>
                <p className="text-sm text-muted mt-1">
                  {e.attendees.length > 0
                    ? e.attendees
                        .slice(0, 3)
                        .map((a) => a.name || a.email)
                        .join(", ") +
                      (e.attendees.length > 3 ? ` +${e.attendees.length - 3}` : "")
                    : "Solo block"}
                </p>
                {e.hangoutLink && (
                  <a
                    href={e.hangoutLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-accent mt-2 inline-block"
                  >
                    Join link
                  </a>
                )}
              </div>
              <div className="text-sm text-muted whitespace-nowrap">
                {formatTime(e.start)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
