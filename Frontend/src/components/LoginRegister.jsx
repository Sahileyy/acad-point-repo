import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Users,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

export default function LoginRegister() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initialForm = {
    registerNumber: "",
    teacherId: "",
    adminName: "",
    department: "",
    institution: "",
    name: "",
    password: "",
    semester: "",
  };

  const [form, setForm] = useState(initialForm);

  const resetForm = () => setForm(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "registerNumber" ? value.toUpperCase() : value });
    setError("");
  };

  const roles = [
    { key: "student", label: "Student", icon: GraduationCap },
    { key: "faculty", label: "Faculty", icon: Users },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let endpoint, payload;

      if (mode === "login") {
        endpoint = "http://localhost:5000/auth/login";
        const idField =
          role === "student"
            ? form.registerNumber
            : role === "faculty"
              ? form.teacherId
              : form.adminName;
        payload = { role, id: idField, password: form.password };
      } else {
        if (role === "student") {
          endpoint = "http://localhost:5000/auth/students/register";
          payload = {
            registerNumber: form.registerNumber,
            name: form.name,
            semester: form.semester,
            password: form.password,
          };
        } else if (role === "faculty") {
          endpoint = "http://localhost:5000/auth/faculty/register";
          payload = {
            teacherId: form.teacherId,
            name: form.name,
            department: form.department,
            password: form.password,
          };
        } else {
          endpoint = "http://localhost:5000/auth/admin/register";
          payload = {
            username: form.adminName,
            department: form.department,
            institution: form.institution,
            password: form.password,
          };
        }
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
        setLoading(false);
        alert("Registration successful! Please login.");
        return;
      }

      sessionStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "student") navigate("/student-dashboard");
      else if (data.user.role === "faculty") navigate("/faculty-dashboard");
      else navigate("/admin-dashboard");
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
          {/* Subtle reflection line for glass effect */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-1 relative z-10">
            {mode === "login" ? "Sign in" : "Create account"}
          </h2>
          <p className="text-sm text-gray-500 mb-6 relative z-10 font-medium">
            {role === "student" ? "Student Portal" : role === "faculty" ? "Faculty Portal" : "Admin Portal"}
          </p>

          {/* Role Tabs */}
          <div className="flex mb-6 bg-white/40 backdrop-blur-md rounded-xl p-1 gap-1 relative z-10 border border-white/40 shadow-inner">
            {roles.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => { setRole(key); resetForm(); setError(""); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${role === key
                  ? "bg-white text-gray-900 shadow-sm border border-white/60"
                  : "text-gray-600 hover:bg-white/30"
                  }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3" autoComplete="off">
            {mode === "register" && (
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                className="w-full clay-input"
                onChange={handleChange}
                required
              />
            )}

            {role === "student" && (
              <input
                name="registerNumber"
                placeholder="Register Number"
                value={form.registerNumber}
                className="w-full clay-input"
                onChange={handleChange}
                autoComplete="off"
                required
              />
            )}

            {role === "faculty" && (
              <input
                name="teacherId"
                placeholder="Teacher ID"
                value={form.teacherId}
                className="w-full clay-input"
                onChange={handleChange}
                required
              />
            )}

            {role === "admin" && (
              <input
                name="adminName"
                placeholder="Admin Username"
                value={form.adminName}
                className="w-full clay-input"
                onChange={handleChange}
                required
              />
            )}

            {((role === "admin") || (role === "faculty" && mode === "register")) && (
              <input
                name="department"
                placeholder="Department"
                value={form.department}
                className="w-full clay-input"
                onChange={handleChange}
                required
              />
            )}

            {role === "admin" && (
              <input
                name="institution"
                placeholder="Institution"
                value={form.institution}
                className="w-full clay-input"
                onChange={handleChange}
                required
              />
            )}

            {role === "student" && mode === "register" && (
              <select
                name="semester"
                value={form.semester}
                className="w-full clay-input text-gray-600 bg-white/50 backdrop-blur-sm shadow-inner"
                onChange={handleChange}
                required
              >
                <option value="">Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>Sem {s} ({s % 2 !== 0 ? "Odd" : "Even"})</option>
                ))}
              </select>
            )}

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
              {loading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            {mode === "login" ? "No account?" : "Already registered?"}
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
