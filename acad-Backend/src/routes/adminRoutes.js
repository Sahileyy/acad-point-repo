import express from "express";
import bcrypt from "bcryptjs";
import Student from "../models/studentSchema.js";
import Faculty from "../models/facultySchema.js";
import Admin from "../models/adminSchema.js";
import Certificate from "../models/certificateSchema.js";
import { verifyToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

/* =========================
   DASHBOARD SUMMARY (Admin)
========================= */
router.get(
    "/summary",
    verifyToken,
    requireRole("admin"),
    async (req, res) => {
        try {
            const totalStudents = await Student.countDocuments();
            const totalFaculty = await Faculty.countDocuments();
            const pendingCerts = await Certificate.countDocuments({ status: "Pending" });
            const approvedCerts = await Certificate.countDocuments({ status: "Approved" });
            const rejectedCerts = await Certificate.countDocuments({ status: "Rejected" });

            // Get unique departments
            const departments = await Student.distinct("department");

            res.json({
                totalStudents,
                totalFaculty,
                totalDepartments: departments.filter(d => d).length,
                pendingCerts,
                approvedCerts,
                rejectedCerts,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/* =========================
   GET ALL FACULTY (Admin)
========================= */
router.get(
    "/faculty",
    verifyToken,
    requireRole("admin"),
    async (req, res) => {
        try {
            const faculty = await Faculty.find().select("-password").sort({ name: 1 });
            res.json(faculty);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/* =========================
   ADD USER (Admin)
========================= */
router.post(
    "/add-user",
    verifyToken,
    requireRole("admin"),
    async (req, res) => {
        try {
            const { role, registerNumber, facultyId, name, department, semester, password } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);

            if (role === "student") {
                const exists = await Student.findOne({ registerNumber });
                if (exists) return res.status(400).json({ message: "Student already exists" });

                await Student.create({
                    registerNumber,
                    name,
                    semester,
                    department,
                    password: hashedPassword,
                });
            } else if (role === "faculty") {
                const exists = await Faculty.findOne({ facultyId });
                if (exists) return res.status(400).json({ message: "Faculty already exists" });

                await Faculty.create({
                    facultyId,
                    name,
                    department,
                    password: hashedPassword,
                });
            } else {
                return res.status(400).json({ message: "Invalid role" });
            }

            res.status(201).json({ message: `${role} added successfully` });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/* =========================
   DELETE USER (Admin)
========================= */
router.delete(
    "/user/:role/:id",
    verifyToken,
    requireRole("admin"),
    async (req, res) => {
        try {
            const { role, id } = req.params;

            if (role === "student") {
                await Student.findByIdAndDelete(id);
                await Certificate.deleteMany({ studentId: id });
            } else if (role === "faculty") {
                await Faculty.findByIdAndDelete(id);
            } else {
                return res.status(400).json({ message: "Invalid role" });
            }

            res.json({ message: `${role} deleted` });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    }
);

export default router;
