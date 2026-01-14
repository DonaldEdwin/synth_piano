import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
    [username, email, hash]
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
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
});

export default router;
