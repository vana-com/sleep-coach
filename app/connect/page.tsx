"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useConnect } from "@opendatalabs/connect-js/react";

export default function ConnectPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const { open, ready } = useConnect({
    containerRef,
    onSuccess: ({ connectionId }) => {
      router.push(`/result?connectionId=${connectionId}`);
    },
    onExit: () => {
      router.push("/");
    },
  });

  useEffect(() => {
    open({
      source: "oura",
      scopes: ["read:readiness", "read:sleep", "read:activity"],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      {!ready && (
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="w-6 h-6 border-2 border-slate-600 border-t-amber-400 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm tracking-wide">
            Connecting to Oura...
          </p>
        </div>
      )}
      <div
        ref={containerRef}
        className={`w-full max-w-md transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ height: ready ? "600px" : "0px" }}
      />
    </main>
  );
}
