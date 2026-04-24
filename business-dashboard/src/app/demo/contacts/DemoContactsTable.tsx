"use client";

import type { Contact } from "@/lib/types";
import { PIPELINE_STAGES } from "@/lib/types";

export function DemoContactsTable({ contacts }: { contacts: Contact[] }) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-panel border border-edge p-6">
        <h2 className="text-lg font-semibold mb-4">Add contact</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={(e) => e.preventDefault()}>
          <input placeholder="Name *" className="px-3 py-2 rounded-lg bg-ink border border-edge" />
          <input placeholder="Email" className="px-3 py-2 rounded-lg bg-ink border border-edge" />
          <input placeholder="Company" className="px-3 py-2 rounded-lg bg-ink border border-edge" />
          <input placeholder="Role" className="px-3 py-2 rounded-lg bg-ink border border-edge" />
          <input
            placeholder="Source (e.g. networking event name)"
            className="px-3 py-2 rounded-lg bg-ink border border-edge md:col-span-2"
          />
          <textarea
            placeholder="Notes — what did you talk about, what matters to them"
            className="px-3 py-2 rounded-lg bg-ink border border-edge md:col-span-2 min-h-[80px]"
          />
          <select className="px-3 py-2 rounded-lg bg-ink border border-edge">
            {PIPELINE_STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-accent text-ink font-medium"
          >
            Add contact
          </button>
        </form>
      </section>

      <section className="rounded-2xl bg-panel border border-edge p-6">
        <h2 className="text-lg font-semibold mb-4">
          All contacts <span className="text-muted text-sm font-normal">({contacts.length})</span>
        </h2>
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
                      defaultValue={c.pipeline_stage}
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
                    {c.last_touch_at ? new Date(c.last_touch_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-xs text-accent">Mark touched</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
