"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Moon, Wind, Activity, Heart, RefreshCw } from "lucide-react";
import { Suspense } from "react";

interface Recommendation {
  title: string;
  explanation: string;
  action: string;
}

interface Plan {
  priority: string;
  recommendations: Recommendation[];
}

const ICONS = [Moon, Wind, Activity, Heart];

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const connectionId = searchParams.get("connectionId");

  const [plan, setPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!connectionId) {
      router.push("/");
      return;
    }

    async function fetchPlan() {
      try {
        const res = await fetch(
          `/api/result?connectionId=${encodeURIComponent(connectionId!)}`,
        );
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? "Failed to generate plan");
        }
        const data = await res.json();
        setPlan(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchPlan();
  }, [connectionId, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="w-6 h-6 border-2 border-slate-600 border-t-amber-400 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm tracking-wide">
            Analysing your last 7 nights...
          </p>
        </div>
      </main>
    );
  }

  if (error || !plan) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <p className="text-slate-400">
            {error ?? "Could not generate your recovery plan."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold uppercase tracking-widest rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <p className="text-amber-400 text-xs uppercase tracking-widest font-semibold">
            Tonight&apos;s Plan
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-slate-50 text-balance">
            Your recovery plan
          </h1>
        </div>

        <div className="bg-amber-500 rounded-xl p-6">
          <p className="text-xs uppercase tracking-widest font-semibold text-amber-950 mb-2">
            Tonight&apos;s priority
          </p>
          <p className="text-slate-950 text-lg font-medium leading-snug">
            {plan.priority}
          </p>
        </div>

        <div className="space-y-4">
          {plan.recommendations.map((rec, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={i}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 p-2 bg-slate-700/50 rounded-lg shrink-0">
                    <Icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-serif text-xl font-light text-slate-50">
                      {rec.title}
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {rec.explanation}
                    </p>
                  </div>
                </div>
                <div className="ml-12 bg-slate-900/60 border border-slate-700/50 rounded-lg px-4 py-3">
                  <p className="text-xs uppercase tracking-widest font-semibold text-amber-400 mb-1">
                    Action
                  </p>
                  <p className="text-slate-200 text-sm">{rec.action}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => router.push("/")}
            className="text-slate-500 hover:text-slate-400 text-sm underline underline-offset-2 transition-colors"
          >
            Start over
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <span className="w-6 h-6 border-2 border-slate-600 border-t-amber-400 rounded-full animate-spin" />
        </main>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
