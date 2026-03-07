import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2 } from "lucide-react";
import api from "../api/axios";


export default function ForgotPassword() {
    const { role } = useParams();
   
    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isStudent = role === "student";

    const roleData = {
        student: {
            image: "/assets/student_login.png",
            title: "Reset Your Password,",
            subtitle: "We've Got You Covered",
            description: "Enter your register number and email to receive a password reset link.",
            badges: ["Secure Reset", "Quick Process", "Student Portal"],
        },
        faculty: {
            image: "/assets/faculty_login.png",
            title: "Reset Your Password,",
            subtitle: "We've Got You Covered",
            description: "Enter your faculty ID and email to receive a password reset link.",
            badges: ["Secure Reset", "Quick Process", "Faculty Portal"],
        },
    };

    const currentRoleData = roleData[role] || roleData.student;

    const handleSubmit = async () => {
        setLoading(true);
        setMessage("");
        setError("");
        try {
            const endpoint = isStudent
                ? "/auth/forgot-password/student"
                : "/auth/forgot-password/faculty";

            const payload = { id, email };

            const { data } = await api.post(endpoint, payload);
            setMessage(data.message);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white lg:bg-gray-50 overflow-hidden">

            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-gray-900 group">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${currentRoleData.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 via-gray-900/40 to-transparent" />
                <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                            <span className="text-xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                                A
                            </span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight">AcadPoint</span>
                    </div>
                    <div className="max-w-xl animate-in delay-2">
                        <h1 className="text-5xl font-extrabold leading-tight mb-4">
                            {currentRoleData.title}
                            <br />
                            <span className="text-white/80">{currentRoleData.subtitle}</span>
                        </h1>
                        <p className="text-lg text-gray-300 mb-8 font-medium">
                            {currentRoleData.description}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {currentRoleData.badges.map((badge, idx) => (
                                <div
                                    key={idx}
                                    className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-semibold flex items-center gap-2"
                                >
                                    <ShieldCheck size={16} className="text-blue-400" />
                                    {badge}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="text-sm text-gray-400 font-medium">
                        © 2026 AcadPoint CMS • Trusted by Universities
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-2/5 flex items-center justify-center p-6 lg:p-12 bg-white">
                <div className="w-full max-w-md animate-in">

                    {/* Mobile Header */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="inline-flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">A</span>
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">AcadPoint</h1>
                        </div>
                        <p className="text-sm text-gray-500">Activity Point Management</p>
                    </div>

                    {/* Card */}
                    <div className="liquid-glass rounded-2xl p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>

                        <h2 className="text-xl font-bold text-gray-900 mb-1 relative z-10">
                            Forgot Password
                        </h2>
                        <p className="text-sm text-gray-500 mb-6 relative z-10 font-medium">
                            {isStudent ? "Student Portal" : "Faculty Portal"}
                        </p>

                        {/* Success Message */}
                        {message && (
                            <div className="mb-4 px-3 py-2 bg-green-50 border border-green-100 rounded-lg text-green-600 text-xs">
                                {message}
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder={isStudent ? "Register Number" : "Faculty ID"}
                                value={id}
                                onChange={(e) => setId(isStudent ? e.target.value.toUpperCase() : e.target.value)}
                                className="w-full clay-input"
                            />
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full clay-input"
                            />

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full clay-btn-dark py-3 text-sm flex items-center justify-center gap-2 mt-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" /> Sending...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>
                        </div>

                        {/* Back to Login */}
                        <p className="text-center text-xs text-gray-400 mt-4">
                            Remembered your password?{" "}

                            <a href="/"
                                className="text-gray-900 font-medium hover:underline"
                            >
                                Sign In
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}