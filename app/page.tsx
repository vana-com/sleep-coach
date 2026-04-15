"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imgVisible, setImgVisible] = useState(false);

  function handleConnect() {
    setLoading(true);
    router.push("/connect");
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden">

      {/* Background image — fades in once loaded */}
      <div
        className="absolute inset-0 transition-opacity duration-[3000ms]"
        style={{ opacity: imgVisible ? 1 : 0 }}
      >
        <Image
          src="https://images.unsplash.com/photo-1531353826977-0941b4779a1c?auto=format&w=1920&q=80"
          alt=""
          fill
          priority
          className="object-cover object-center scale-105"
          onLoad={() => setImgVisible(true)}
        />
      </div>

      {/* Layered dark overlays for legibility */}
      <div className="absolute inset-0 bg-slate-950/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/90" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        <p className="text-amber-400 text-xs uppercase tracking-widest font-semibold">
          Sleep Coach
        </p>

        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light leading-tight text-balance text-slate-50 drop-shadow-lg">
          Your ring knows more than your alarm does
        </h1>

        <p className="text-slate-300 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed text-balance">
          Connect your Oura Ring to get a recovery plan built from your actual
          data.
        </p>

        <div className="pt-4">
          <button
            onClick={handleConnect}
            disabled={loading}
            className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-sm font-semibold uppercase tracking-widest rounded-lg transition-colors duration-150 shadow-lg shadow-amber-900/20"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect Oura Ring"
            )}
          </button>
        </div>

        <p className="text-slate-500 text-sm">
          Powered by{" "}
          <a
            href="https://opendatalabs.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-300 underline underline-offset-2 transition-colors"
          >
            Context Gateway
          </a>{" "}
          by Open Data Labs
        </p>
      </div>
    </main>
  );
}
