const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db } = require("../db/index"); // note: .js removed for CommonJS

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { fullname, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO users (fullname, email, password_hash) VALUES (?, ?, ?)",
    [fullname, email, hash]
  );

  res.json({ ok: true });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [[user]] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, fullname: user.fullname },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
});

module.exports = router;
