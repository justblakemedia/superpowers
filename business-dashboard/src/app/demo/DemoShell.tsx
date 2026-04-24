"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function DemoShell({
  userName,
  children,
}: {
  userName: string;
  children: ReactNode;
}) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-ink text-white">
      <div className="bg-accent/10 border-b border-accent/40 text-accent text-xs px-8 py-2">
        DEMO MODE — mock data, no real Gmail/Calendar/Claude calls
      </div>
      <header className="border-b border-edge px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-muted text-sm">{today}</p>
          <h1 className="text-2xl font-semibold">Good morning, {userName}.</h1>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/demo" className="text-white hover:text-accent">
            Dashboard
          </Link>
          <Link href="/demo/contacts" className="text-muted hover:text-accent">
            Contacts
          </Link>
        </nav>
      </header>
      <div className="max-w-6xl mx-auto px-8 py-8 space-y-6">{children}</div>
    </main>
  );
}
