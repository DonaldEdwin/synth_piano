import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import audioRoutes from "./routes/audios.js";
import commentRoutes from "./routes/comments.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("server/uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/audios", audioRoutes);
app.use("/api/comments", commentRoutes);

app.listen(3001, () => {
  console.log("API running on http://localhost:3001");
});
