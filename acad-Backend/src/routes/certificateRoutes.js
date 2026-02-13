import express from "express";
import Certificate from "../models/certificateSchema.js";
import Student from "../models/studentSchema.js";
import { verifyToken, requireRole } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* =========================
   UPLOAD CERTIFICATE (Student)
========================= */
router.post(
    "/upload",
    verifyToken,
    requireRole("student"),
    upload.single("certificate"),
    async (req, res) => {
        try {
            const { group, subCategory, title, description, pointsClaimed } = req.body;

            if (!req.file) {
                return res.status(400).json({ message: "Certificate file is required" });
            }

            if (!["I", "II", "III"].includes(group)) {
                return res.status(400).json({ message: "Invalid group. Must be I, II, or III" });
            }

            const points = parseInt(pointsClaimed);
            if (isNaN(points) || points < 1 || points > 40) {
                return res.status(400).json({ message: "Points must be between 1 and 40" });
            }

            const cert = await Certificate.create({
                studentId: req.user.id,
                group,
                subCategory,
                title,
                description: description || "",
                pointsClaimed: points,
                filePath: req.file.path.replace(/\\/g, "/"),
            });

            res.status(201).json({
                message: "Certificate uploaded successfully",
                certificate: cert,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/* =========================
   GET MY CERTIFICATES (Student)
========================= */
router.get(
    "/my",
    verifyToken,
    requireRole("student"),
    async (req, res) => {
        try {
            const certs = await Certificate.find({ studentId: req.user.id }).sort({
                createdAt: -1,
            });
            res.json(certs);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/* =========================
   GET ALL CERTIFICATES (Faculty / Admin)
========================= */
router.get(
    "/all",
    verifyToken,
    requireRole("faculty", "admin"),
    async (req, res) => {
        try {
            const { status, studentId } = req.query;
            const filter = {};
            if (status) filter.status = status;
            if (studentId) filter.studentId = studentId;

            const certs = await Certificate.find(filter)
                .populate("studentId", "registerNumber name semester department")
                .populate("reviewedBy", "name facultyId")
                .sort({ createdAt: -1 });

            res.json(certs);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/* =========================
   APPROVE / REJECT CERTIFICATE (Faculty)
========================= */
router.put(
    "/:id/review",
    verifyToken,
    requireRole("faculty", "admin"),
    async (req, res) => {
        try {
            const { status, remarks } = req.body;

            if (!["Approved", "Rejected"].includes(status)) {
                return res.status(400).json({ message: "Status must be Approved or Rejected" });
            }

            const cert = await Certificate.findById(req.params.id);
            if (!cert) {
                return res.status(404).json({ message: "Certificate not found" });
            }

            // Update certificate status
            cert.status = status;
            cert.remarks = remarks || "";
            cert.reviewedBy = req.user.id;
            cert.reviewedAt = new Date();
            await cert.save();

            // If approved, update the student's activity points
            if (status === "Approved") {
                const student = await Student.findById(cert.studentId);
                if (student) {
                    const groupKey =
                        cert.group === "I" ? "groupI" :
                            cert.group === "II" ? "groupII" : "groupIII";

                    const currentPoints = student.activityPoints[groupKey];
                    const newPoints = Math.min(currentPoints + cert.pointsClaimed, 40);
                    student.activityPoints[groupKey] = newPoints;
                    await student.save();
                }
            }

            res.json({ message: `Certificate ${status.toLowerCase()}`, certificate: cert });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    }
);

export default router;
