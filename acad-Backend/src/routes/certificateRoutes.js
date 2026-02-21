import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Certificate from "../models/certificateSchema.js";
import Student from "../models/studentSchema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowed = [".jpg", ".jpeg", ".png", ".pdf"];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, PNG, and PDF files are allowed"));
        }
    },
});

// 1. Submit a certificate (Student) — with real file upload
router.post("/submit", upload.single("certificateFile"), async (req, res) => {
    try {
        const { studentId, group, activityType, certificateName, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "Certificate file is required" });
        }

        const newCert = new Certificate({
            studentId,
            group,
            activityType,
            certificateName,
            description,
            filePath: req.file.filename,
        });

        await newCert.save();
        res.status(201).json({ message: "Certificate submitted successfully", certificate: newCert });
    } catch (error) {
        console.error("Error submitting certificate:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 2. Get certificates for a specific student
router.get("/student/:studentId", async (req, res) => {
    try {
        const certs = await Certificate.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
        res.status(200).json(certs);
    } catch (error) {
        console.error("Error fetching student certificates:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 3. Get pending certificates (for faculty)
router.get("/pending", async (req, res) => {
    try {
        const pendingCerts = await Certificate.find({ status: "Pending" })
            .populate("studentId", "name registerNumber semester")
            .sort({ createdAt: 1 });
        res.status(200).json(pendingCerts);
    } catch (error) {
        console.error("Error fetching pending certificates:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 4. Review certificate (Assign points and Approve/Reject)
router.put("/review/:id", async (req, res) => {
    try {
        const { status, points, remarks, verifiedBy } = req.body;

        const updatedCert = await Certificate.findByIdAndUpdate(
            req.params.id,
            { status, points, remarks, verifiedBy },
            { new: true }
        );

        if (!updatedCert) return res.status(404).json({ error: "Certificate not found" });

        res.status(200).json({ message: "Certificate reviewed successfully", certificate: updatedCert });
    } catch (error) {
        console.error("Error reviewing certificate:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 5. Get all certificates (for admin verification stats)
router.get("/all", async (req, res) => {
    try {
        const certs = await Certificate.find().populate("studentId", "name registerNumber");
        res.status(200).json(certs);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
