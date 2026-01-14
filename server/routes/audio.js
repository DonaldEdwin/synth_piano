const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = Router();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /\.(mp3|wav|m4a|ogg|flac)$/i;
    if (allowedTypes.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only audio files are allowed."));
    }
  },
});

// GET /api/audios
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT audios.*, users.username
      FROM audios
      JOIN users ON users.id = audios.user_id
      ORDER BY audios.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching audios:", error);
    res.status(500).json({ error: "Failed to fetch audios" });
  }
});

// POST /api/audios (auth)
router.post("/", requireAuth, upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const { title } = req.body;
    if (!title || title.trim() === "") {
      // Delete uploaded file if title is invalid
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Title is required" });
    }

    const filePath = `/uploads/${req.file.filename}`;

    await db.query(
      "INSERT INTO audios (user_id, title, file_path) VALUES (?, ?, ?)",
      [req.user.id, title.trim(), filePath]
    );

    res.status(201).json({ 
      success: true, 
      message: "Audio uploaded successfully",
      filePath 
    });
  } catch (error) {
    console.error("Error uploading audio:", error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: "Failed to upload audio" });
  }
});

module.exports = router;