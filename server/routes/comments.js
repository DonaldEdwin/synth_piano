import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/comments/:audioId
router.get("/:audioId", async (req, res) => {
  const { audioId } = req.params;

  const [rows] = await db.query(`
    SELECT comments.*, users.username
    FROM comments
    JOIN users ON users.id = comments.user_id
    WHERE audio_id = ?
    ORDER BY comments.created_at ASC
  `, [audioId]);

  res.json(rows);
});

// POST /api/comments/:audioId (auth)
router.post("/:audioId", requireAuth, async (req, res) => {
  const { audioId } = req.params;
  const { body } = req.body;

  await db.query(
    "INSERT INTO comments (audio_id, user_id, body) VALUES (?, ?, ?)",
    [audioId, req.user.id, body]
  );

  res.json({ ok: true });
});

export default router;
