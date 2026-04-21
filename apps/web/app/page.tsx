"use client";

import { useEffect, useState } from "react";
import WeatherDashboard from "../components/WeatherDashboard";

export default function HomePage() {
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const isLoggedIn = localStorage.getItem("loggedIn") === "true";
      setLoggedIn(isLoggedIn);
    } finally {
      setReady(true);
    }
  }, []);

  function handleLogin() {
    setLoading(true);
    localStorage.setItem("loggedIn", "true");
    setLoggedIn(true);
    setLoading(false);
  }

  function handleLogout() {
    localStorage.removeItem("loggedIn");
    setLoggedIn(false);
  }

  if (!ready) {
    return null;
  }

  if (!loggedIn) {
    return (
      <div style={{ padding: 50 }}>
        <h1>Login</h1>
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <button onClick={handleLogout}>Logout</button>
      <WeatherDashboard />
    </div>
  );
}
