"use client";

import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    setLoading(true);
    localStorage.setItem("loggedIn", "true");
    window.location.href = "/";
  }

  return (
    <div style={{ padding: 50 }}>
      <h1>Login</h1>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}
