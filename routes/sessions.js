const express = require("express");
const router = express.Router();
const { readData, writeData } = require("./db");

const FILE = "sessions.json";

//Helper: validate rating (for difficulty, effort, preparation so we dont have to repeat the validation) (1-10)
function isValidRating(val) {
  const n = Number(val);
  return Number.isFinite(n) && n >= 1 && n <= 10;
}

// --- GET /sessions - list all sessions, with optional filters --------------------------
// Query params: dateFrom, dateTo, minDistance, maxDistance, minDifficulty, maxDifficulty, minEffort, maxEffort
router.get("/", (req, res) => {
  let sessions = readData(FILE);

  const { dateFrom, dateTo, minDistance, maxDistance, minDifficulty, maxDifficulty, minEffort, maxEffort } = req.query;

  if (dateFrom) sessions = sessions.filter((s) => s.date >= dateFrom);
  if (dateTo) sessions = sessions.filter((s) => s.date <= dateTo);
  if (minDistance) sessions = sessions.filter((s) => s.totalDistance >= Number(minDistance));
  if (maxDistance) sessions = sessions.filter((s) => s.totalDistance <= Number(maxDistance));
  if (minDifficulty) sessions = sessions.filter((s) => s.difficultyRating >= Number(minDifficulty));
  if (maxDifficulty) sessions = sessions.filter((s) => s.difficultyRating <= Number(maxDifficulty));
  if (minEffort) sessions = sessions.filter((s) => s.effortRating >= Number(minEffort));
  if (maxEffort) sessions = sessions.filter((s) => s.effortRating <= Number(maxEffort));

  // Return newest first
  sessions.sort((a, b) => (a.date < b.date ? 1 : -1));

  res.json(sessions);
});

// --- GET /sessions/stats - statistics/progress overview --------------------------
// Query params: dateFrom, dateTo (optional - defaults to current month)
router.get("/stats", (req, res) => {
  let sessions = readData(FILE);

  const now = new Date();

  // Default range: current month
  const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const defaultTo = now.toISOString().slice(0, 10);

  const dateFrom = req.query.dateFrom || defaultFrom;
  const dateTo = req.query.dateTo || defaultTo;

  const filtered = sessions.filter((s) => s.date >= dateFrom && s.date <= dateTo);

  // KPI 1: total distance in range
  const totalDistance = filtered.reduce((sum, s) => sum + (s.totalDistance || 0), 0);

  // KPI 2: number of sessions this week
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  const weekFrom = startOfWeek.toISOString().slice(0, 10);
  const sessionsThisWeek = sessions.filter((s) => s.date >= weekFrom && s.date <= defaultTo).length;

  // KPI 3 & 4: average effort and preparation ratings in range
  let avgEffort = null;
  let avgPreparation = null;

  if (filtered.length > 0) {
    avgEffort = +(filtered.reduce((sum, s) => sum + (s.effortRating || 0), 0) / filtered.length).toFixed(2);
    avgPreparation = +(filtered.reduce((sum, s) => sum + (s.preparationRating || 0), 0) / filtered.length).toFixed(2);
  }

  // Chart 1: weekly distance for the last 8 weeks
  const weeklyDistance = buildWeeklyDistance(sessions, 8);

  // Chart 2: effort rating per session for the last 30 sessions (in range if provided, else null)
  const last30 = sessions
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 30)
    .reverse()
    .map((s) => ({ id: s.id, date: s.date, effortRating: s.effortRating }));

  res.json({
    range: { dateFrom, dateTo },
    kpis: {
      totalDistance,
      sessionsThisWeek,
      avgEffortRating: avgEffort,
      avgPreparationRating: avgPreparation,
    },
    charts: {
      weeklyDistance,
      effortTrend: last30,
    },
  });
});

// --- GET /sessions/:id --- get details of a single session by ID --------------------------
router.get("/:id", (req, res) => {
  const sessions = readData(FILE);
  const session = sessions.find((s) => s.id === Number(req.params.id));
  if (!session) return res.status(404).json({ error: "Session not found" });
  res.json(session);
});

// --- POST /sessions - create a new session --------------------------
router.post("/", (req, res) => {
  const { date, warmup, mainSet, recovery, totalDistance, difficultyRating, effortRating, preparationRating, notes } = req.body;

  // Required fields
  if (!date) return res.status(400).json({ error: "date is required" });
  if (!totalDistance || isNaN(totalDistance)) return res.status(400).json({ error: "totalDistance must be a number" });
  if (!isValidRating(difficultyRating)) return res.status(400).json({ error: "difficultyRating must be 1-10" });
  if (!isValidRating(effortRating)) return res.status(400).json({ error: "effortRating must be 1-10" });
  if (!isValidRating(preparationRating)) return res.status(400).json({ error: "preparationRating must be 1-10" });

  const sessions = readData(FILE);
  const nextId = sessions.length > 0 ? Math.max(...sessions.map((s) => s.id)) + 1 : 1;

  const newSession = {
    id: nextId,
    date: date,
    warmup: warmup || "",
    mainSet: mainSet || "",
    recovery: recovery || "",
    totalDistance: Number(totalDistance),
    difficultyRating: Number(difficultyRating),
    effortRating: Number(effortRating),
    preparationRating: Number(preparationRating),
    notes: notes || "",
  };

  sessions.push(newSession);
  writeData(FILE, sessions);
  res.status(201).json(newSession);
});

// --- PUT /sessions/:id - update a session --------------------------
router.put("/:id", (req, res) => {
  const sessions = readData(FILE);
  const index = sessions.findIndex((s) => s.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Session not found" });

  const allowed = ["date", "warmup", "mainSet", "recovery", "totalDistance", "difficultyRating", "effortRating", "preparationRating", "notes" ];
  const updates = {};

  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  // Validate ratings if present
  for (const ratingKey of ["difficultyRating", "effortRating", "preparationRating"]) {
    if (updates[ratingKey] !== undefined && !isValidRating(updates[ratingKey])) {
      return res.status(400).json({ error: `${ratingKey} must be 1-10` });
    }
    if (updates[ratingKey] !== undefined) updates[ratingKey] = Number(updates[ratingKey]);
  }

  if (updates.totalDistance !== undefined) updates.totalDistance = Number(updates.totalDistance);

  sessions[index] = { ...sessions[index], ...updates};
  writeData(FILE, sessions);
  res.json(sessions[index]);
});

// --- DELETE /sessions/:id --------------------------
router.delete("/:id", (req, res) => {
  const sessions = readData(FILE);
  const index = sessions.findIndex((s) => s.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Session not found" });

  sessions.splice(index, 1);
  writeData(FILE, sessions);
  res.json({ message: "Session deleted" });
});

// --- build weekly distance data for the last N weeks for the chart --------------------------
function buildWeeklyDistance(sessions, numWeeks) {
  const weeks = [];
  const now = new Date();

  for (let i = numWeeks - 1; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const from = weekStart.toISOString().slice(0, 10);
    const to = weekEnd.toISOString().slice(0, 10);

    const distance = sessions
      .filter((s) => s.date >= from && s.date <= to)
      .reduce((sum, s) => sum + (s.totalDistance || 0), 0);

    weeks.push({ weekStart: from, weekEnd: to, totalDistance: distance });
  }

  return weeks;
}

module.exports = router;