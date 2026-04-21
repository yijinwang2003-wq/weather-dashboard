"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      setIsLoggedIn(localStorage.getItem("loggedIn") === "true");
    } catch (error) {
      setAuthError("Could not read login state. You can still continue in demo mode.");
    } finally {
      setCheckingLogin(false);
    }
  }, []);

  useEffect(() => {
    if (!checkingLogin && isLoggedIn) {
      router.replace("/");
    }
  }, [checkingLogin, isLoggedIn, router]);

  function handleSignIn() {
    setLoading(true);
    setAuthError(null);

    try {
      localStorage.setItem("loggedIn", "true");
    } catch (error) {
      setAuthError("Could not save login state, but demo mode is enabled for now.");
    }

    setIsLoggedIn(true);
    router.push("/");
  }

  if (checkingLogin) {
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

        <div className="space-y-5">
          {authError ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {authError}
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleSignIn}
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(15,23,42,0.18)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <button
            type="button"
            onClick={handleSignIn}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition hover:border-slate-300 hover:bg-slate-50"
          >
            Continue as demo user
          </button>
        </div>
      </div>
    </div>
  );
}
