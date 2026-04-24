"use client";

import { useState } from "react";
import type { Contact } from "@/lib/db";

function daysSince(iso: string | null): string {
  if (!iso) return "never";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export function FollowUpsCard({ contacts }: { contacts: Contact[] }) {
  const [drafting, setDrafting] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, { subject: string; body: string }>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});

  async function draft(contactId: number) {
    setDrafting(contactId);
    setErrors((e) => ({ ...e, [contactId]: "" }));
    try {
      const res = await fetch(`/api/followups/draft?contact_id=${contactId}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Draft failed");
      setDrafts((d) => ({ ...d, [contactId]: data }));
    } catch (err: any) {
      setErrors((e) => ({ ...e, [contactId]: err.message }));
    } finally {
      setDrafting(null);
    }
  }

  async function saveAsGmailDraft(contactId: number) {
    const draft = drafts[contactId];
    const contact = contacts.find((c) => c.id === contactId);
    if (!draft || !contact?.email) return;
    setErrors((e) => ({ ...e, [contactId]: "" }));
    try {
      const res = await fetch("/api/followups/save-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: contact.email, ...draft, contact_id: contactId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setErrors((e) => ({ ...e, [contactId]: "Saved to Gmail drafts." }));
    } catch (err: any) {
      setErrors((e) => ({ ...e, [contactId]: err.message }));
    }
  }

  return (
    <section className="rounded-2xl bg-panel border border-edge p-6">
      <h2 className="text-lg font-semibold mb-4">Follow-ups due</h2>
      {contacts.length === 0 ? (
        <p className="text-muted">
          No active contacts yet. Add some on the{" "}
          <a href="/contacts" className="text-accent">
            Contacts page
          </a>
          .
        </p>
      ) : (
        <ul className="space-y-3">
          {contacts.map((c) => (
            <li key={c.id} className="border border-edge rounded-xl p-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium">
                    {c.name}
                    {c.company && (
                      <span className="text-muted font-normal"> · {c.company}</span>
                    )}
                  </p>
                  <p className="text-sm text-muted mt-1">
                    Last touch: {daysSince(c.last_touch_at)} ·{" "}
                    <span className="capitalize">{c.pipeline_stage}</span>
                    {c.next_action && ` · ${c.next_action}`}
                  </p>
                </div>
                <button
                  onClick={() => draft(c.id)}
                  disabled={drafting === c.id || !c.email}
                  className="px-3 py-1.5 text-sm rounded-lg bg-accent text-ink font-medium disabled:opacity-40"
                >
                  {drafting === c.id ? "Drafting..." : "Draft email"}
                </button>
              </div>
              {drafts[c.id] && (
                <div className="mt-3 border border-edge rounded-lg p-3 bg-ink">
                  <p className="text-sm font-medium mb-2">{drafts[c.id].subject}</p>
                  <pre className="text-sm whitespace-pre-wrap text-muted">
                    {drafts[c.id].body}
                  </pre>
                  <button
                    onClick={() => saveAsGmailDraft(c.id)}
                    className="mt-3 text-xs text-accent"
                  >
                    Save to Gmail drafts →
                  </button>
                </div>
              )}
              {errors[c.id] && (
                <p className="mt-2 text-xs text-muted">{errors[c.id]}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
