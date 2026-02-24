import express from "express";
import Student from "../models/studentSchema.js";
import Faculty from "../models/facultySchema.js";
import Certificate from "../models/certificateSchema.js";

const router = express.Router();

// 1. Get all students (Admin & Faculty)
router.get("/students", async (req, res) => {
    try {
        const { department } = req.query;
        const filter = department ? { department } : {};
        const students = await Student.find(filter, "-password"); // Exclude passwords

        // Let's also fetch their points
        const allCerts = await Certificate.find({ status: "Approved" });

        const studentsWithPoints = students.map(student => {
            const studentCerts = allCerts.filter(c => c.studentId.toString() === student._id.toString());
            const totalPoints = studentCerts.reduce((sum, cert) => sum + (cert.points || 0), 0);
            return {
                ...student.toObject(),
                points: totalPoints
            };
        });

        res.status(200).json(studentsWithPoints);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 2. Get all teachers (Admin)
router.get("/teachers", async (req, res) => {
    try {
        const { department } = req.query;
        const filter = department ? { department } : {};
        const teachers = await Faculty.find(filter, "-password");
        res.status(200).json(teachers);
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 3. Admin dashboard stats
router.get("/dashboard-stats", async (req, res) => {
    try {
        const studentCount = await Student.countDocuments();
        const teacherCount = await Faculty.countDocuments();
        // Assuming 6 departments for now, could be derived from distinct
        const pendingRequests = await Certificate.countDocuments({ status: "Pending" });
        const approvedRequests = await Certificate.countDocuments({ status: "Approved" });
        const rejectedRequests = await Certificate.countDocuments({ status: "Rejected" });

        res.status(200).json({
            totalStudents: studentCount,
            totalTeachers: teacherCount,
            departments: 6,
            pendingApprovals: pendingRequests,
            verificationStats: {
                total: pendingRequests + approvedRequests + rejectedRequests,
                approved: approvedRequests,
                pending: pendingRequests,
                rejected: rejectedRequests
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// 4. Update user status (Active/Deactivated)
// Requires a 'status' field in schema, defaulting to 'Active'
// We might not have that yet, so let's just update role or a new field if added
router.put("/:id/status", async (req, res) => {
    try {
        // If you add a status field to the schema, you'd update it here:
        // await Student.findByIdAndUpdate(req.params.id, { status: req.body.status });
        res.status(200).json({ message: "Status updating not fully implemented without schema update" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
