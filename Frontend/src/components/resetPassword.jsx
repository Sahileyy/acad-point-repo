import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2, Eye, EyeOff } from "lucide-react";
import axios from "../api/axios";

export default function ResetPassword() {
  const { role, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isStudent = role === "student";

  const roleData = {
    student: {
      image: "/assets/student_login.png",
      title: "Create New Password,",
      subtitle: "You're Almost There",
      description: "Set a new secure password for your student account.",
      badges: ["Secure Reset", "Quick Process", "Student Portal"],
    },
    faculty: {
      image: "/assets/faculty_login.png",
      title: "Create New Password,",
      subtitle: "You're Almost There",
      description: "Set a new secure password for your faculty account.",
      badges: ["Secure Reset", "Quick Process", "Faculty Portal"],
    },
  };

  const currentRoleData = roleData[role] || roleData.student;

  const handleSubmit = async () => {
    if (password !== confirm) {
      return setError("Passwords do not match");
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `/auth/reset-password/${role}/${token}`,
        { password }
      );
      setMessage(res.data.message);
      setTimeout(() => navigate("/"), 2000);
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
              Reset Password
            </h2>
            <p className="text-sm text-gray-500 mb-6 relative z-10 font-medium">
              {isStudent ? "Student Portal" : "Faculty Portal"}
            </p>

            {/* Success */}
            {message && (
              <div className="mb-4 px-3 py-2 bg-green-50 border border-green-100 rounded-lg text-green-600 text-xs">
                {message} Redirecting to login...
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-4 px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs">
                {error}
              </div>
            )}

            {/* Form */}
            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full clay-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full clay-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full clay-btn-dark py-3 text-sm flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              Remembered your password?{" "}
              <a href="/" className="text-gray-900 font-medium hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}