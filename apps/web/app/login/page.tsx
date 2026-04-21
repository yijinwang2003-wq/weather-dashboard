"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    if (isLoggedIn) {
      router.replace("/");
      return;
    }

    setShowLogin(true);
    setReady(true);
  }, [router]);

  function handleLogin() {
    setLoading(true);
    localStorage.setItem("loggedIn", "true");
    router.replace("/");
  }

  if (!ready || !showLogin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(241,245,249,0.92)_38%,_rgba(226,232,240,0.96)_100%)] px-4 py-10">
        <div className="rounded-[28px] border border-white/70 bg-white/80 px-6 py-4 text-sm font-medium text-slate-600 shadow-[0_20px_60px_rgba(15,23,42,0.1)] backdrop-blur-xl">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(241,245,249,0.92)_38%,_rgba(226,232,240,0.96)_100%)] px-4 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
            Secure Access
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            Sign in to Weather Dashboard
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Demo login for your school project. No backend and no validation.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(15,23,42,0.18)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </div>
  );
}
