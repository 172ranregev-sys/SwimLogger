const express = require("express");
const cors = require("cors");

const sessionsRouter = require("./routes/sessions");
const usersRouter = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);

// Health check
app.get("/", (req, res) => res.json({ status: "SwimLogger API running" }));

app.listen(PORT, () => console.log(`SwimLogger API listening on http://localhost:${PORT}`));