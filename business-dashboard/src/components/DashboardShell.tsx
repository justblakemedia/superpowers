"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import type { ReactNode } from "react";

export function DashboardShell({
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
      <header className="border-b border-edge px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-muted text-sm">{today}</p>
          <h1 className="text-2xl font-semibold">Good morning, {userName.split(" ")[0]}.</h1>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-white hover:text-accent">
            Dashboard
          </Link>
          <Link href="/contacts" className="text-muted hover:text-accent">
            Contacts
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="text-muted hover:text-accent"
          >
            Sign out
          </button>
        </nav>
      </header>
      <div className="max-w-6xl mx-auto px-8 py-8 space-y-6">{children}</div>
    </main>
  );
}
