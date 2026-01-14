import { Router } from "express";
import multer from "multer";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const storage = multer.diskStorage({
  destination: "server/uploads",
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage });

// GET /api/audios
router.get("/", async (req, res) => {
  const [rows] = await db.query(`
    SELECT audios.*, users.username
    FROM audios
    JOIN users ON users.id = audios.user_id
    ORDER BY audios.created_at DESC
  `);

  res.json(rows);
});

// POST /api/audios (auth)
router.post("/", requireAuth, upload.single("audio"), async (req, res) => {
  const { title } = req.body;
  const filePath = `/uploads/${req.file.filename}`;

  await db.query(
    "INSERT INTO audios (user_id, title, file_path) VALUES (?, ?, ?)",
    [req.user.id, title, filePath]
  );

  res.json({ ok: true });
});

export default router;
