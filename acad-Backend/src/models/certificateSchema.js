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
            enum: ["Group I", "Group II", "Group III"],
            required: true,
        },
        activityType: {
            type: String,
            required: true,
        },
        certificateName: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        points: {
            type: Number,
            min: 1,
            max: 40,
            default: null,
        },
        filePath: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
        remarks: {
            type: String,
            default: "",
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Faculty",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Certificate", certificateSchema);
