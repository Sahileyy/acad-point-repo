import express from "express";
import Student from "../models/studentSchema.js";
import Certificate from "../models/certificateSchema.js";
import { verifyToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

/* =========================
   GET MY PROFILE (Student)
========================= */
router.get(
  "/profile",
  verifyToken,
  requireRole("student"),
  async (req, res) => {
    try {
      const student = await Student.findById(req.user.id).select("-password");
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Count pending certificates
      const pendingCount = await Certificate.countDocuments({
        studentId: req.user.id,
        status: "Pending",
      });

      res.json({
        ...student.toObject(),
        pendingCertificates: pendingCount,
        totalPointsEarned:
          student.activityPoints.groupI +
          student.activityPoints.groupII +
          student.activityPoints.groupIII,
        totalPointsRequired: 120,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* =========================
   GET ALL STUDENTS (Faculty / Admin)
========================= */
router.get(
  "/all",
  verifyToken,
  requireRole("faculty", "admin"),
  async (req, res) => {
    try {
      const students = await Student.find().select("-password").sort({ name: 1 });

      // For each student, count pending certificates
      const studentsWithPending = await Promise.all(
        students.map(async (s) => {
          const pendingCount = await Certificate.countDocuments({
            studentId: s._id,
            status: "Pending",
          });
          return {
            ...s.toObject(),
            pendingCertificates: pendingCount,
            totalPointsEarned:
              s.activityPoints.groupI +
              s.activityPoints.groupII +
              s.activityPoints.groupIII,
          };
        })
      );

      res.json(studentsWithPending);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* =========================
   GET STUDENT BY ID (Faculty / Admin)
========================= */
router.get(
  "/:id",
  verifyToken,
  requireRole("faculty", "admin"),
  async (req, res) => {
    try {
      const student = await Student.findById(req.params.id).select("-password");
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(student);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
