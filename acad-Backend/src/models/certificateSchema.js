import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        group: {
            type: String,
            enum: ["I", "II", "III"],
            required: true,
        },

        subCategory: {
            type: String,
            required: true,
            // Group I  : NSS, NCC, NSO, Arts, Sports, Games, Club Activities
            // Group II : English Cert, Aptitude Cert, Internship, Workshop,
            //            Conference, Paper Presentation, Hackathon
            // Group III: Journal Publication, Patent, Start-up, Innovation,
            //            National/International Hackathon Winner, Skilling Certificate
        },

        title: { type: String, required: true },
        description: { type: String, default: "" },
        pointsClaimed: { type: Number, required: true, min: 1, max: 40 },

        // File upload path
        filePath: { type: String, required: true },

        // Approval workflow
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Faculty",
            default: null,
        },

        remarks: { type: String, default: "" },
        reviewedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

export default mongoose.model("Certificate", certificateSchema);
