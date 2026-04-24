export function DemoBriefing({ body }: { body: string }) {
  return (
    <section className="rounded-2xl bg-panel border border-edge p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold">Today's focus</h2>
        <button
          disabled
          className="px-3 py-1.5 text-sm rounded-lg border border-edge opacity-50 cursor-not-allowed"
        >
          Regenerate
        </button>
      </div>
      <pre className="text-sm whitespace-pre-wrap leading-relaxed font-sans">{body}</pre>
    </section>
  );
}
