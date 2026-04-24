"use client";

import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-ink text-white">
      <div className="max-w-md w-full p-8 rounded-2xl bg-panel border border-edge">
        <h1 className="text-2xl font-semibold mb-2">Business Dashboard</h1>
        <p className="text-muted mb-6">
          Sign in with the Google account that has your work Gmail and Calendar.
        </p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full py-3 rounded-xl bg-accent text-ink font-medium hover:opacity-90"
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}
