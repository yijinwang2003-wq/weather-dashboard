// ============================================================
// Weather Dashboard - Background Worker
//
// This script runs on your computer and does three things
// every 60 seconds:
//   1. Reads all cities from your Supabase "cities" table
//   2. Fetches live weather from the Open-Meteo API for each city
//   3. Saves the weather data into your "weather_updates" table
//
// To run:   npm start            (from the apps/worker folder)
// To stop:  press Ctrl + C
// ============================================================

// ------------------------------------------------------------
// Step 1: Load environment variables from the .env file
// ------------------------------------------------------------
// dotenv reads your .env file and makes each line available as
// process.env.VARIABLE_NAME so we don't hardcode secrets.
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

// ------------------------------------------------------------
// Step 2: Read config and validate
// ------------------------------------------------------------
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const POLL_INTERVAL_MS = 60_000; // 60 seconds

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    "ERROR: Missing environment variables!\n\n" +
      "Fix: copy .env.example to .env and paste in your Supabase credentials.\n" +
      "     cp .env.example .env\n"
  );
  process.exit(1);
}

// The service role key bypasses Row Level Security so the worker
// can read/write any table without being a logged-in user.
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ------------------------------------------------------------
// Step 3: Fetch all cities from Supabase
// ------------------------------------------------------------
async function getCities() {
  const { data, error } = await supabase
    .from("cities")
    .select("id, name, latitude, longitude");

  if (error) {
    throw new Error(`Failed to fetch cities: ${error.message}`);
  }

  return data; // e.g. [{ id: 1, name: "Tokyo", latitude: 35.68, longitude: 139.69 }, ...]
}

// ------------------------------------------------------------
// Step 4: Call Open-Meteo API for one city
// ------------------------------------------------------------
// Open-Meteo is free, requires no API key, and returns JSON.
// Docs: https://open-meteo.com/en/docs
async function fetchWeather(latitude, longitude) {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    "&current=temperature_2m,wind_speed_10m,weather_code";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Open-Meteo API error: ${response.status} ${response.statusText}`
    );
  }

  const json = await response.json();

  // The response looks like:
  // {
  //   "current": {
  //     "temperature_2m": 22.5,
  //     "wind_speed_10m": 8.3,
  //     "weather_code": 1,
  //     "time": "2026-04-20T14:00"
  //   }
  // }
  return {
    temperature: json.current.temperature_2m,
    windspeed: json.current.wind_speed_10m,
    weather_code: json.current.weather_code,
    observed_at: json.current.time,
  };
}

// ------------------------------------------------------------
// Step 5: Upsert weather data into Supabase
// ------------------------------------------------------------
// "Upsert" = INSERT a new row, OR UPDATE an existing row if the
// city_id already exists (thanks to our UNIQUE constraint).
async function upsertWeather(cityId, weather) {
  const { error } = await supabase.from("weather_updates").upsert(
    {
      city_id: cityId,
      temperature: weather.temperature,
      windspeed: weather.windspeed,
      weather_code: weather.weather_code,
      observed_at: weather.observed_at,
    },
    { onConflict: "city_id" }
  );

  if (error) {
    throw new Error(
      `Failed to upsert weather for city ${cityId}: ${error.message}`
    );
  }
}

// ------------------------------------------------------------
// Step 6: One polling cycle (called every 60 seconds)
// ------------------------------------------------------------
async function pollWeather() {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`\n[${timestamp}] Polling weather data...`);

  // 6a. Get all cities
  let cities;
  try {
    cities = await getCities();
  } catch (err) {
    console.error("  Error fetching cities:", err.message);
    return; // skip this cycle, try again next time
  }

  if (cities.length === 0) {
    console.log("  No cities found. Add some rows to your cities table first!");
    return;
  }

  console.log(`  Found ${cities.length} city(s). Fetching weather...`);

  // 6b. Fetch weather + upsert for each city, one at a time
  let successCount = 0;

  for (const city of cities) {
    try {
      const weather = await fetchWeather(city.latitude, city.longitude);
      await upsertWeather(city.id, weather);

      console.log(
        `  ✓ ${city.name}: ${weather.temperature}°C, ` +
          `wind ${weather.windspeed} km/h, ` +
          `code ${weather.weather_code}`
      );
      successCount++;
    } catch (err) {
      // Log the error but keep going — one city failing
      // should not stop the others from updating.
      console.error(`  ✗ ${city.name}: ${err.message}`);
    }
  }

  console.log(`  Done. Updated ${successCount}/${cities.length} cities.`);
}

// ------------------------------------------------------------
// Step 7: Start the worker
// ------------------------------------------------------------
console.log("=".repeat(50));
console.log("  Weather Worker");
console.log(`  Polling every ${POLL_INTERVAL_MS / 1000} seconds`);
console.log("  Press Ctrl+C to stop");
console.log("=".repeat(50));

// Run once immediately, then repeat on a timer
pollWeather();
setInterval(pollWeather, POLL_INTERVAL_MS);
