import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Users, Shield, ArrowRight, Loader2 } from "lucide-react";
import api from "../api/axios";

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("student"); // student | faculty | admin
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [regNo, setRegNo] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [username, setUsername] = useState(""); // admin
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("Odd");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const res = await api.post("/auth/login", {
          role,
          identifier:
            role === "student" ? regNo : role === "faculty" ? facultyId : username,
          password,
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        if (role === "student") navigate("/student-dashboard");
        else if (role === "faculty") navigate("/faculty-dashboard");
        else navigate("/admin-dashboard");
      } else {
        // Register
        const endpoint =
          role === "student"
            ? "/auth/register/student"
            : role === "faculty"
            ? "/auth/register/faculty"
            : "/auth/register/admin";

        const payload = {
          name,
          password,
          role,
          ...(role === "student" && { registerNumber: regNo, semester }),
          ...(role === "faculty" && { facultyId, department }),
          ...(role === "admin" && { username, department, institution: "ACAD" }),
        };

        await api.post(endpoint, payload);
        alert("Registration successful! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const roleIcons = {
    student: <GraduationCap size={28} className="text-white" />,
    faculty: <Users size={28} className="text-white" />,
    admin: <Shield size={28} className="text-white" />,
  };

  const roleLabels = {
    student: "Student Portal",
    faculty: "Faculty Portal",
    admin: "Admin Portal",
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white relative">
      {/* Topographic Wave Background */}
      <div className="w-full h-[45vh] topo-pattern relative flex flex-col items-center justify-center text-white p-6">
        <div className="z-10 text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">ACAD-POINT</h1>
          <p className="text-sky-100 font-light text-lg">Activity Point Management System</p>
        </div>
        
        {/* Wave Divider SVG */}
        <div className="wave-divider-bottom">
           <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
             <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
           </svg>
        </div>
      </div>

      {/* Glass Card Floating Over Wave */}
      <div className="w-full max-w-md -mt-32 z-20 px-4">
        <div className="glass-card bg-white p-8 mb-8">
          
          {/* Role Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            {["student", "faculty", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  role === r
                    ? "bg-sky-500 text-white shadow-lg scale-110"
                    : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                }`}
                title={r.charAt(0).toUpperCase() + r.slice(1)}
              >
                {/* Dynamically render icon based on internal map, but we need to pass props manually if not using the object directly */}
                {r === "student" && <GraduationCap size={24} />}
                {r === "faculty" && <Users size={24} />}
                {r === "admin" && <Shield size={24} />}
              </button>
            ))}
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">{isLogin ? "Welcome Back" : "Create Account"}</h2>
            <p className="text-slate-500 text-sm mt-1">{roleLabels[role]}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            
            {/* Common Fields for Registration */}
            {!isLogin && (
              <div className="group">
                <input
                  className="input-minimal"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Role Specific Fields */}
            {role === "student" && (
              <>
                <div className="group">
                  <input
                    className="input-minimal"
                    placeholder="Register Number"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    required
                  />
                </div>
                {!isLogin && (
                  <div className="group">
                    <select 
                      className="input-minimal bg-transparent"
                      value={semester} 
                      onChange={(e) => setSemester(e.target.value)}
                    >
                      <option value="Odd">Odd Semester</option>
                      <option value="Even">Even Semester</option>
                    </select>
                  </div>
                )}
              </>
            )}

            {role === "faculty" && (
              <>
                <div className="group">
                  <input
                    className="input-minimal"
                    placeholder="Faculty ID"
                    value={facultyId}
                    onChange={(e) => setFacultyId(e.target.value)}
                    required
                  />
                </div>
                {!isLogin && (
                  <div className="group">
                    <input
                      className="input-minimal"
                      placeholder="Department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                    />
                  </div>
                )}
              </>
            )}

            {role === "admin" && (
              <>
                <div className="group">
                  <input
                    className="input-minimal"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                {!isLogin && (
                   <div className="group">
                    <input
                      className="input-minimal"
                      placeholder="Department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                    />
                  </div>
                )}
              </>
            )}

            <div className="group">
              <input
                type="password"
                className="input-minimal"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-wave flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Register"} <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            {isLogin ? "New here? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-sky-600 hover:text-sky-700 hover:underline transition-colors"
            >
              {isLogin ? "Create an account" : "Sign in"}
            </button>
          </div>
        </div>
        
        {/* Footer info */}
        <p className="text-center text-xs text-slate-400">
          © 2024 ACAD-POINT System v1.0
        </p>
      </div>
    </div>
  );
}
