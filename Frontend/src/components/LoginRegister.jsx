import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Users, Shield, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import api from "../api/axios";
import studentLoginBg from "../assets/student-login.jpg";

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

  // Clear inputs when switching roles/modes
  useEffect(() => {
    setRegNo("");
    setFacultyId("");
    setUsername("");
    setPassword("");
    setName("");
  }, [role, isLogin]);

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
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("user", JSON.stringify(res.data.user));

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

  const isStudent = role === "student";

  return (
    <div className={`min-h-screen flex flex-col items-center relative ${!isStudent ? 'bg-white' : 'bg-slate-900'}`}>
      
      {/* Background Image for Student */}
      {isStudent && (
        <div className="absolute inset-0 z-0">
           <img 
              src={studentLoginBg} 
              alt="Student Campus" 
              className="w-full h-full object-cover opacity-60" 
           />
           <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90"></div>
        </div>
      )}

      {/* Header Section */}
      <div className={`w-full relative flex flex-col items-center justify-center text-white p-6 z-10 transition-all duration-500 ease-in-out ${
          isStudent ? 'h-auto py-16' : 'h-[45vh] topo-pattern'
      }`}>
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight drop-shadow-sm">ACAD-POINT</h1>
          <p className="text-sky-100 font-light text-lg tracking-wide opacity-90">Activity Point Management System</p>
        </div>
        
        {/* Wave Divider (Only for non-students) */}
        {!isStudent && (
          <div className="wave-divider-bottom">
             <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
               <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
             </svg>
          </div>
        )}
      </div>

      {/* Glass Card */}
      <div className={`w-full max-w-md z-20 px-4 transition-all duration-500 ${isStudent ? '-mt-4' : '-mt-32'}`}>
        <div className={`glass-card p-8 mb-8 backdrop-blur-xl border border-white/20 shadow-2xl ${
            isStudent ? 'bg-white/10 text-white' : 'bg-white text-slate-800'
        }`}>
          
          {/* Role Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            {["student", "faculty", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 w-24 ${
                  role === r
                    ? "bg-sky-600 text-white shadow-lg scale-105 shadow-sky-500/30"
                    : isStudent ? "bg-white/5 text-slate-300 hover:bg-white/10" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                }`}
              >
                {r === "student" && <GraduationCap size={20} />}
                {r === "faculty" && <Users size={20} />}
                {r === "admin" && <Shield size={20} />}
                <span className="text-xs font-semibold capitalize">{r}</span>
              </button>
            ))}
          </div>

          <div className="text-center mb-8">
            <h2 className={`text-2xl font-bold ${isStudent ? 'text-white' : 'text-slate-800'}`}>
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className={`text-sm mt-1 ${isStudent ? 'text-slate-300' : 'text-slate-500'}`}>
               {isLogin ? `Login to your ${role} dashboard` : `Register as a new ${role}`}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isStudent ? 'text-slate-300' : 'text-slate-500'}`}>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all ${
                      isStudent 
                      ? 'bg-white/5 border border-white/10 text-white placeholder-slate-500' 
                      : 'bg-slate-50 border border-slate-200 text-slate-800'
                  }`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isStudent ? 'text-slate-300' : 'text-slate-500'}`}>
                {role === "student"
                  ? "Register Number"
                  : role === "faculty"
                  ? "Faculty ID"
                  : "Username"}
              </label>
              <input
                type="text"
                placeholder={
                  role === "student"
                    ? "e.g. 23BCA45"
                    : role === "faculty"
                    ? "e.g. FAC001"
                    : "Admin Username"
                }
                className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all ${
                    isStudent 
                    ? 'bg-white/5 border border-white/10 text-white placeholder-slate-500' 
                    : 'bg-slate-50 border border-slate-200 text-slate-800'
                }`}
                value={
                  role === "student"
                    ? regNo
                    : role === "faculty"
                    ? facultyId
                    : username
                }
                onChange={(e) => {
                  if (role === "student") setRegNo(e.target.value.toUpperCase());
                  else if (role === "faculty") setFacultyId(e.target.value);
                  else setUsername(e.target.value);
                }}
                required
              />
            </div>

            {/* Department & Semester for Registration */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isStudent ? 'text-slate-300' : 'text-slate-500'}`}>Department</label>
                    <select
                      className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all ${
                          isStudent 
                          ? 'bg-white/5 border border-white/10 text-white' 
                          : 'bg-slate-50 border border-slate-200 text-slate-800'
                      }`}
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                    >
                       <option value="" className="text-slate-800">Select Dept</option>
                       <option value="CSE" className="text-slate-800">CSE</option>
                       <option value="BCA" className="text-slate-800">BCA</option>
                       <option value="ECE" className="text-slate-800">ECE</option>
                       <option value="EEE" className="text-slate-800">EEE</option>
                       <option value="MECH" className="text-slate-800">MECH</option>
                    </select>
                 </div>
                 {role === "student" && (
                     <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isStudent ? 'text-slate-300' : 'text-slate-500'}`}>Semester</label>
                        <select
                          className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all ${
                            isStudent 
                            ? 'bg-white/5 border border-white/10 text-white' 
                            : 'bg-slate-50 border border-slate-200 text-slate-800'
                          }`}
                          value={semester}
                          onChange={(e) => setSemester(e.target.value)}
                        >
                           <option value="Odd" className="text-slate-800">Odd</option>
                           <option value="Even" className="text-slate-800">Even</option>
                        </select>
                     </div>
                 )}
              </div>
            )}

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isStudent ? 'text-slate-300' : 'text-slate-500'}`}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all ${
                    isStudent 
                    ? 'bg-white/5 border border-white/10 text-white placeholder-slate-500' 
                    : 'bg-slate-50 border border-slate-200 text-slate-800'
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 rounded-xl text-sm uppercase tracking-wider font-bold shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 mt-4 hover:scale-[1.02] transition-transform"
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

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className={`text-sm font-medium hover:underline ${isStudent ? 'text-sky-300' : 'text-sky-600'}`}
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className={`text-center text-xs ${isStudent ? 'text-slate-400' : 'text-slate-400'}`}>
           <p>© 2024 Acad-Point. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
