"use client";

import { useState } from "react";
import type { Contact } from "@/lib/types";
import { PIPELINE_STAGES } from "@/lib/types";

const blank = {
  name: "",
  email: "",
  company: "",
  role: "",
  source: "",
  notes: "",
  pipeline_stage: "networking",
};

export function ContactsTable({ initial }: { initial: Contact[] }) {
  const [contacts, setContacts] = useState<Contact[]>(initial);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setContacts((c) => [data.contact, ...c]);
      setForm(blank);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function updateStage(id: number, stage: string) {
    const res = await fetch(`/api/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pipeline_stage: stage }),
    });
    if (res.ok) {
      const data = await res.json();
      setContacts((cs) => cs.map((c) => (c.id === id ? data.contact : c)));
    }
  }

  async function markTouched(id: number) {
    const now = new Date().toISOString();
    const res = await fetch(`/api/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ last_touch_at: now }),
    });
    if (res.ok) {
      const data = await res.json();
      setContacts((cs) => cs.map((c) => (c.id === id ? data.contact : c)));
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-panel border border-edge p-6">
        <h2 className="text-lg font-semibold mb-4">Add contact</h2>
        <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            placeholder="Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-3 py-2 rounded-lg bg-ink border border-edge"
            required
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="px-3 py-2 rounded-lg bg-ink border border-edge"
          />
          <input
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="px-3 py-2 rounded-lg bg-ink border border-edge"
          />
          <input
            placeholder="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="px-3 py-2 rounded-lg bg-ink border border-edge"
          />
          <input
            placeholder="Source (e.g. networking event name)"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            className="px-3 py-2 rounded-lg bg-ink border border-edge md:col-span-2"
          />
          <textarea
            placeholder="Notes — what did you talk about, what matters to them"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="px-3 py-2 rounded-lg bg-ink border border-edge md:col-span-2 min-h-[80px]"
          />
          <select
            value={form.pipeline_stage}
            onChange={(e) => setForm({ ...form, pipeline_stage: e.target.value })}
            className="px-3 py-2 rounded-lg bg-ink border border-edge"
          >
            {PIPELINE_STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-accent text-ink font-medium disabled:opacity-50"
          >
            {saving ? "Saving..." : "Add contact"}
          </button>
          {error && <p className="text-sm text-muted md:col-span-2">{error}</p>}
        </form>
      </section>

      <section className="rounded-2xl bg-panel border border-edge p-6">
        <h2 className="text-lg font-semibold mb-4">
          All contacts <span className="text-muted text-sm font-normal">({contacts.length})</span>
        </h2>
        {contacts.length === 0 ? (
          <p className="text-muted">No contacts yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted border-b border-edge">
                <tr>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Company</th>
                  <th className="py-2 pr-4">Stage</th>
                  <th className="py-2 pr-4">Last touch</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id} className="border-b border-edge">
                    <td className="py-3 pr-4">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted">{c.email}</div>
                    </td>
                    <td className="py-3 pr-4">
                      {c.company}
                      {c.role && <div className="text-xs text-muted">{c.role}</div>}
                    </td>
                    <td className="py-3 pr-4">
                      <select
                        value={c.pipeline_stage}
                        onChange={(e) => updateStage(c.id, e.target.value)}
                        className="px-2 py-1 rounded bg-ink border border-edge text-xs"
                      >
                        {PIPELINE_STAGES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 pr-4 text-muted">
                      {c.last_touch_at
                        ? new Date(c.last_touch_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-3 pr-4">
                      <button
                        onClick={() => markTouched(c.id)}
                        className="text-xs text-accent"
                      >
                        Mark touched
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
