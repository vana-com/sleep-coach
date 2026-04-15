"use client";

import { OpenDataLabsProvider } from "@opendatalabs/connect-js/react";
import { ReactNode } from "react";

async function createSession(input: {
  source: string;
  scopes?: string[];
  appId?: string;
}) {
  const res = await fetch("/api/connect-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error("Failed to create connect session");
  }
  return res.json();
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <OpenDataLabsProvider createSession={createSession}>
      {children}
    </OpenDataLabsProvider>
  );
}
