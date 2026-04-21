"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("loggedIn") === "true") {
        router.replace("/");
        return;
      }
    } finally {
      setReady(true);
    }
  }, [router]);

  function handleLogin() {
    setLoading(true);
    localStorage.setItem("loggedIn", "true");
    router.replace("/");
  }

  if (!ready) {
    return null;
  }

  return (
    <div style={{ padding: 50 }}>
      <h1>Login</h1>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <div style={{ marginTop: 20 }}>
        <a href="/">Back to home</a>
      </div>
    </div>
  );
}
