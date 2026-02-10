import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Users,
  Eye,
  EyeOff
} from "lucide-react";

export default function LoginRegister() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // login | register
  const [role, setRole] = useState("student"); // student | faculty
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    registerNumber: "",
    teacherId: "",
    name: "",
    password: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const endpoint =
    role === "student"
      ? mode === "login"
        ? "http://localhost:5000/students/login"
        : "http://localhost:5000/students/register"
      : mode === "login"
        ? "http://localhost:5000/faculty/login"
        : "http://localhost:5000/faculty/register";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload =
      role === "student"
        ? {
            registerNumber: form.registerNumber,
            name: form.name,
            password: form.password
          }
        : {
            teacherId: form.teacherId,
            name: form.name,
            password: form.password
          };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Authentication failed");
      return;
    }

    if (data.role === "student") {
      localStorage.setItem("student", JSON.stringify(data.student));
      navigate("/student-dashboard");
    } else {
      localStorage.setItem("faculty", JSON.stringify(data.faculty));
      navigate("/faculty-dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-500 to-indigo-600 p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            {role === "student"
              ? <GraduationCap size={36} className="text-sky-600" />
              : <Users size={36} className="text-indigo-600" />}
          </div>
          <h1 className="text-2xl font-bold">
            {mode ===   " login " ? "Welcome back" : "Create Account"}
          </h1>
          <p className="text-gray-500 text-sm">
            {role === "student" ? "Student Portal" : "Faculty Portal"}
          </p>
        </div>

        {/* Role Switch */}
        <div className="flex mb-6 bg-gray-100 rounded-xl overflow-hidden">
          {["student", "faculty"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2 font-semibold transition ${
                role === r
                  ? "bg-sky-500 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {r === "student" ? "Student" : "Faculty"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {mode === "register" && (
            <input
              name="name"
              placeholder=" full Name"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-400 outline-none"
              onChange={handleChange}
              required
            />
          )}

          {role === "student" ? (
            <input
              name="registerNumber"
              placeholder="Register Number"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-400 outline-none"
              onChange={handleChange}
              required
            />
          ) : (
            <input
              name="teacherId"
              placeholder="Teacher ID"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-400 outline-none"
              onChange={handleChange}
              required
            />
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full border rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-sky-400 outline-none"
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition">
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-sm text-gray-600 mt-4">
          {mode === "login" ? "No account?" : "Already registered?"}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="ml-2 text-sky-600 font-semibold hover:underline"
          >
            {mode === "login" ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
