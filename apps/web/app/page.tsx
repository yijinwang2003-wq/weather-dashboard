"use client";

import { useEffect, useState } from "react";
import WeatherDashboard from "../components/WeatherDashboard";

export default function HomePage() {
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    setLoggedIn(isLoggedIn);
    setReady(true);
  }, []);

  function handleLogout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "/login";
  }

  if (!ready) {
    return (
      <div style={{ padding: 50 }}>Loading...</div>
    );
  }

  if (!loggedIn) {
    return (
      <div style={{ padding: 50 }}>
        <h1>Not logged in</h1>
        <a href="/login">Go to login</a>
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
