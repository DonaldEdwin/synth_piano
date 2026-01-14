const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Import route files
const authRoutes = require("./routes/auth");
const audioRoutes = require("./routes/audio");
const commentRoutes = require("./routes/comments");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("server/uploads"));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/audios", audioRoutes);
app.use("/api/comments", commentRoutes);

const PORT = process.env.PORT || 3001;

// Bind to 0.0.0.0 so other containers can reach it
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on http://0.0.0.0:${PORT}`);
});
