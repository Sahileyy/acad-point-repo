import express from "express";
import bcrypt from "bcryptjs";

import Student from "../models/studentSchema.js";
import Faculty from "../models/facultySchema.js";
import Admin from "../models/adminSchema.js";

const router = express.Router();

/* =========================
   LOGIN (Student / Faculty / Admin)
========================= */
router.post("/auth/login", async (req, res) => {
  try {
    const { role, id, password } = req.body;

    let user;

    if (role === "student") {
      user = await Student.findOne({ registerNumber: id });
    } 
    else if (role === "faculty") {
      user = await Faculty.findOne({ facultyId: id });
    } 
    else if (role === "admin") {
      user = await Admin.findOne({ username: id });
    } 
    else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name || user.username,
        role: user.role,
        semester: user.semester || null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   STUDENT REGISTER
========================= */
router.post("/students/register", async (req, res) => {
  try {
    const { registerNumber, name, semester, password } = req.body;

    const exists = await Student.findOne({ registerNumber });
    if (exists) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Student.create({
      registerNumber,
      name,
      semester,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
