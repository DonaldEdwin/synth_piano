const { Router } = require("express");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = Router();

// GET /api/comments/:audioId
router.get("/:audioId", async (req, res) => {
  try {
    const { audioId } = req.params;

    // Validate audioId
    if (!audioId || isNaN(audioId)) {
      return res.status(400).json({ error: "Invalid audio ID" });
    }

    const [rows] = await db.query(`
      SELECT comments.*, users.fullname
      FROM comments
      JOIN users ON users.id = comments.user_id
      WHERE audio_id = ?
      ORDER BY comments.created_at ASC
    `, [parseInt(audioId)]);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// GET /api/comments (get all comments - optional)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT comments.*, users.fullname, audios.title as audio_title
      FROM comments
      JOIN users ON users.id = comments.user_id
      JOIN audios ON audios.id = comments.audio_id
      ORDER BY comments.created_at DESC
      LIMIT 100
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching all comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// POST /api/comments/:audioId (auth)
router.post("/:audioId", requireAuth, async (req, res) => {
  try {
    const { audioId } = req.params;
    const { body } = req.body;

    // Validate inputs
    if (!audioId || isNaN(audioId)) {
      return res.status(400).json({ error: "Invalid audio ID" });
    }

    if (!body || body.trim() === "") {
      return res.status(400).json({ error: "Comment body is required" });
    }

    // Check if audio exists
    const [audioExists] = await db.query(
      "SELECT id FROM audios WHERE id = ?",
      [parseInt(audioId)]
    );

    if (audioExists.length === 0) {
      return res.status(404).json({ error: "Audio not found" });
    }

    // Insert comment
    const [result] = await db.query(
      "INSERT INTO comments (audio_id, user_id, body) VALUES (?, ?, ?)",
      [parseInt(audioId), req.user.id, body.trim()]
    );

    // Get the newly created comment with user info
    const [newComment] = await db.query(`
      SELECT comments.*, users.fullname
      FROM comments
      JOIN users ON users.id = comments.user_id
      WHERE comments.id = ?
    `, [result.insertId]);

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment[0]
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

router.delete("/:commentId", requireAuth, async (req, res) => {
  try {
    const { commentId } = req.params;

    // Check if comment exists and belongs to user
    const [comment] = await db.query(
      "SELECT * FROM comments WHERE id = ? AND user_id = ?",
      [parseInt(commentId), req.user.id]
    );

    if (comment.length === 0) {
      return res.status(404).json({ 
        error: "Comment not found or you don't have permission to delete it" 
      });
    }

    await db.query("DELETE FROM comments WHERE id = ?", [parseInt(commentId)]);

    res.json({ 
      success: true, 
      message: "Comment deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

module.exports = router;