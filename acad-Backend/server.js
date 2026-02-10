import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import studentRoutes from "./src/routes/studentRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

const app = express();

/* ================== MIDDLEWARE ================== */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());

/* ================== ROUTES ================== */
app.use("/students", studentRoutes);
app.use("/auth", authRoutes);

/* ================== DATABASE ================== */
mongoose
  .connect("mongodb://127.0.0.1:27017/acad-point")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

/* ================== SERVER ================== */
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
