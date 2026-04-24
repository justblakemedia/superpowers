"use client";

import { useState, useEffect } from "react";

export function BriefingCard({ date }: { date: string }) {
  const [body, setBody] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch(`/api/briefing?date=${date}`)
      .then((r) => r.json())
      .then((d) => setBody(d.body_md ?? ""))
      .catch(() => {});
  }, [date]);

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/briefing/generate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setBody(data.body_md);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl bg-panel border border-edge p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold">Today's focus</h2>
        <button
          onClick={generate}
          disabled={loading}
          className="px-3 py-1.5 text-sm rounded-lg border border-edge hover:bg-edge disabled:opacity-50"
        >
          {loading ? "Thinking..." : body ? "Regenerate" : "Generate briefing"}
        </button>
      </div>
      {error && <p className="text-sm text-muted mb-3">{error}</p>}
      {body ? (
        <pre className="text-sm whitespace-pre-wrap leading-relaxed">{body}</pre>
      ) : (
        <p className="text-muted">
          Click <span className="text-white">Generate briefing</span> to get today's
          strategic read on your meetings, inbox, and follow-ups.
        </p>
      )}
    </section>
  );
}
