import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./src/routes/authRoutes.js";
import studentRoutes from "./src/routes/studentRoutes.js";
import certificateRoutes from "./src/routes/certificateRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ================== MIDDLEWARE ================== */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Serve uploaded certificate files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================== ROUTES ================== */
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/* ================== DATABASE ================== */
mongoose
  .connect("mongodb://127.0.0.1:27017/acad-point")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

/* ================== SERVER ================== */
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
