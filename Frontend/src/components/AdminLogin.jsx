import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLogin() {
    const navigate = useNavigate();

    const [mode, setMode] = useState("login");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const initialForm = {
        adminName: "",
        department: "",
        institution: "",
        password: "",
    };

    const [form, setForm] = useState(initialForm);

    const resetForm = () => setForm(initialForm);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let endpoint, payload;

            if (mode === "login") {
                endpoint = "http://localhost:5000/auth/login";
                payload = { role: "admin", id: form.adminName, password: form.password };
            } else {
                endpoint = "http://localhost:5000/auth/admin/register";
                payload = {
                    username: form.adminName,
                    department: form.department,
                    institution: form.institution,
                    password: form.password,
                };
            }

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Authentication failed");
                setLoading(false);
                return;
            }

            if (mode === "register") {
                setMode("login");
                resetForm();
                setLoading(false);
                alert("Admin registered successfully! Please login.");
                return;
            }

            sessionStorage.setItem("user", JSON.stringify(data.user));
            navigate("/admin-dashboard");
        } catch (err) {
            console.error(err);
            setError("Connection failed. Is the server running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-sm animate-in">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">AcadPoint</h1>
                    <p className="text-sm text-gray-400 mt-1">Activity Point Management</p>
                </div>

                {/* Card */}
                <div className="liquid-glass rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>

                    {/* Title */}
                    <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck size={20} className="text-gray-700" />
                        <h2 className="text-xl font-bold text-gray-900">
                            {mode === "login" ? "Admin Sign In" : "Admin Registration"}
                        </h2>
                    </div>
                    <p className="text-sm text-gray-500 mb-6 font-medium">Restricted Access</p>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3" autoComplete="off">
                        {mode === "register" && (
                            <>
                                <input
                                    name="department"
                                    placeholder="Department"
                                    value={form.department}
                                    className="w-full clay-input"
                                    onChange={handleChange}
                                    autoComplete="off"
                                    required
                                />
                                <input
                                    name="institution"
                                    placeholder="Institution"
                                    value={form.institution}
                                    className="w-full clay-input"
                                    onChange={handleChange}
                                    autoComplete="off"
                                    required
                                />
                            </>
                        )}

                        <input
                            name="adminName"
                            placeholder="Admin Username"
                            value={form.adminName}
                            className="w-full clay-input"
                            onChange={handleChange}
                            autoComplete="off"
                            required
                        />

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                className="w-full clay-input pr-10"
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full clay-btn-dark py-3 text-sm flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : mode === "login" ? "Sign In" : "Register Admin"}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-400 mt-4">
                        {mode === "login" ? "New admin?" : "Already registered?"}
                        <button
                            onClick={() => { setMode(mode === "login" ? "register" : "login"); resetForm(); setError(""); }}
                            className="ml-1 text-gray-900 font-medium hover:underline"
                        >
                            {mode === "login" ? "Register" : "Sign In"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
