const express = require("express");
const router = express.Router();
const { readData, writeData } = require("./db");

const FILE = "users.json";

// GET all users
router.get("/", (req, res) => {
  const users = readData(FILE);
  res.json(users);
});

// POST create a new user
router.post("/", (req, res) => {
  const { name, role } = req.body;

  if (!name || !role) return res.status(400).json({ error: "name and role are required" });
  if (!["Swimmer", "Coach"].includes(role)) return res.status(400).json({ error: "role must be Swimmer or Coach" });

  const users = readData(FILE);
  const nextId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  const newUser = { id: nextId, name, role };

  users.push(newUser);
  writeData(FILE, users);
  res.status(201).json(newUser);
});

// DELETE a user
router.delete("/:id", (req, res) => {
  const users = readData(FILE);
  const index = users.findIndex((u) => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "User not found" });

  users.splice(index, 1);
  writeData(FILE, users);
  res.json({ message: "User deleted" });
});

module.exports = router;