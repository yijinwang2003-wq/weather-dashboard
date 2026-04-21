"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// Map WMO weather codes to simple descriptions
const WEATHER_DESCRIPTIONS = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Icy fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Light showers",
  81: "Showers",
  82: "Heavy showers",
  95: "Thunderstorm",
};

function getWeatherDescription(code) {
  return WEATHER_DESCRIPTIONS[code] ?? `Code ${code}`;
}

function getWeatherIcon(code) {
  const iconClassName = "h-8 w-8";

  if (code === 0) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={iconClassName}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
      </svg>
    );
  }

  if ([1, 2, 3].includes(code)) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClassName}
      >
        <path d="M7 18h9a4 4 0 0 0 .3-8A5.5 5.5 0 0 0 6.1 9.2 3.8 3.8 0 0 0 7 18Z" />
        <path d="M15 7.5A3.5 3.5 0 0 1 18.5 11" />
      </svg>
    );
  }

  if ([45, 48].includes(code)) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className={iconClassName}
      >
        <path d="M4 10h16" />
        <path d="M2.5 14h12" />
        <path d="M6 18h13" />
      </svg>
    );
  }

  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClassName}
      >
        <path d="M7 15.5h9a4 4 0 0 0 .3-8A5.5 5.5 0 0 0 6.1 6.7 3.8 3.8 0 0 0 7 15.5Z" />
        <path d="M9 18.5 8 21" />
        <path d="M13 18.5 12 21" />
        <path d="M17 18.5 16 21" />
      </svg>
    );
  }

  if ([71, 73, 75].includes(code)) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClassName}
      >
        <path d="M7 14.5h9a4 4 0 0 0 .3-8A5.5 5.5 0 0 0 6.1 5.7 3.8 3.8 0 0 0 7 14.5Z" />
        <path d="m9 18 1 1.2L11.2 18 10 16.8 8.8 18Z" />
        <path d="m13 19 1 1.2 1.2-1.2-1.2-1.2L13 19Z" />
        <path d="m16 17.5 1 1.2 1.2-1.2-1.2-1.2-1 1.2Z" />
      </svg>
    );
  }

  if (code === 95) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClassName}
      >
        <path d="M7 14.5h9a4 4 0 0 0 .3-8A5.5 5.5 0 0 0 6.1 5.7 3.8 3.8 0 0 0 7 14.5Z" />
        <path d="m12.5 15.5-2 3h2l-1 3 3-4h-2l1-2Z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClassName}
    >
      <path d="M7 18h9a4 4 0 0 0 .3-8A5.5 5.5 0 0 0 6.1 9.2 3.8 3.8 0 0 0 7 18Z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function formatTime(timestamp) {
  if (!timestamp) return "Never";
  return new Date(timestamp).toLocaleString();
}

function normalizeWeatherUpdate(weatherUpdates) {
  if (!weatherUpdates) return null;
  if (Array.isArray(weatherUpdates)) {
    return weatherUpdates[0] ?? null;
  }
  return weatherUpdates;
}

export default function WeatherDashboard() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch cities + weather on mount ---
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      // Join cities with their weather_updates row
      const { data, error: fetchError } = await supabase
        .from("cities")
        .select(
          "id, name, weather_updates!left(temperature, windspeed, weather_code, observed_at)"
        )
        .order("name");

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setCities(data);
      setLoading(false);
    }

    fetchData();
  }, []);

  // --- Realtime: update cards when the worker writes new data ---
  useEffect(() => {
    const channel = supabase
      .channel("weather-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "weather_updates" },
        (payload) => {
          const row = payload.new;

          setCities((prev) =>
            prev.map((city) => {
              if (city.id !== row.city_id) return city;
              return {
                ...city,
                weather_updates: {
                  temperature: row.temperature,
                  windspeed: row.windspeed,
                  weather_code: row.weather_code,
                  observed_at: row.observed_at,
                },
              };
            })
          );
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // --- Loading / error / empty states ---
  if (loading) {
    return (
      <div className="rounded-[28px] border border-white/60 bg-white/70 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <p className="text-sm font-medium tracking-wide text-slate-500">
          Loading weather data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[28px] border border-red-200/80 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
          Weather Sync Error
        </p>
        <p className="mt-3 text-base text-red-700">Error: {error}</p>
      </div>
    );
  }

  if (cities.length === 0) {
    return (
      <div className="rounded-[28px] border border-white/60 bg-white/70 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <p className="text-sm font-medium tracking-wide text-slate-500">
          No cities found. Add some to the database!
        </p>
      </div>
    );
  }

  // --- City cards ---
  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-white/60 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(241,245,249,0.82)_42%,_rgba(226,232,240,0.9)_100%)] p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
              Live Overview
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Weather Dashboard
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            Real-time conditions across your tracked cities with a quieter visual
            hierarchy, clearer temperature emphasis, and faster scanability.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {cities.map((city) => {
        const weather = normalizeWeatherUpdate(city.weather_updates);
        const weatherDescription = weather
          ? getWeatherDescription(weather.weather_code)
          : "Awaiting update";

        return (
          <div
            key={city.id}
            className="group relative overflow-hidden rounded-[30px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(248,250,252,0.78))] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(15,23,42,0.14)]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.95),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(191,219,254,0.3),_transparent_32%)] opacity-90" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    City
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                    {city.name}
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_30px_rgba(15,23,42,0.08)]">
                  {weather ? getWeatherIcon(weather.weather_code) : getWeatherIcon(-1)}
                </div>
              </div>

              {weather ? (
                <>
                  <div className="mt-8 flex items-end gap-3">
                    <p className="text-6xl font-semibold tracking-tight text-slate-950 sm:text-7xl">
                      {Math.round(weather.temperature)}
                    </p>
                    <p className="pb-3 text-2xl font-medium text-slate-500">°C</p>
                  </div>

                  <div className="mt-4 inline-flex items-center rounded-full border border-white/70 bg-white/75 px-3 py-1.5 text-sm font-medium text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                    {weatherDescription}
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/70 bg-white/65 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                        Wind
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        {weather.windspeed} km/h
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/70 bg-white/65 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                        Updated
                      </p>
                      <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                        {formatTime(weather.observed_at)}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-8 rounded-3xl border border-dashed border-slate-200 bg-white/40 p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                  <p className="text-sm font-medium text-slate-500">
                    No weather data yet
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
