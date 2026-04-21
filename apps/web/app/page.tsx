"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WeatherDashboard from "../components/WeatherDashboard";

export default function HomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    setLoggedIn(true);
    setReady(true);
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("loggedIn");
    router.replace("/login");
  }

  if (!ready || !loggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(241,245,249,0.92)_38%,_rgba(226,232,240,0.96)_100%)] px-4 py-10">
        <div className="rounded-[28px] border border-white/70 bg-white/80 px-6 py-4 text-sm font-medium text-slate-600 shadow-[0_20px_60px_rgba(15,23,42,0.1)] backdrop-blur-xl">
          Loading dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(241,245,249,0.92)_38%,_rgba(226,232,240,0.96)_100%)] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/70 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Demo Session
            </p>
            <p className="mt-2 text-sm text-slate-700">Logged in with localStorage</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition hover:border-slate-300 hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>

        <WeatherDashboard />
      </div>
    </main>
  );
}
