"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WeatherDashboard from "./WeatherDashboard";

export default function AuthDashboard() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    try {
      if (localStorage.getItem("loggedIn") === "true") {
        setAllowed(true);
        return;
      }
    } catch (error) {
      setAuthError("Login check failed. Falling back to demo user.");
      setAllowed(true);
      return;
    } finally {
      setCheckingAccess(false);
    }

    router.replace("/login");
  }, [router]);

  function handleSignOut() {
    try {
      localStorage.removeItem("loggedIn");
    } catch (error) {
      setAuthError("Could not clear login state. Redirecting to login anyway.");
    }
    router.push("/login");
  }

  if (checkingAccess || !allowed) {
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
            {authError ? (
              <p className="mt-2 text-sm text-amber-700">{authError}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleSignOut}
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
