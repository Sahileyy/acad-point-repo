import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Users,
  GraduationCap,
  Building,
  FileText,
  LogOut,
  Plus,
  Trash2,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import api from "../api/axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [activeTab, setActiveTab] = useState("summary");
  const [loading, setLoading] = useState(true);

  // Data
  const [summary, setSummary] = useState({});
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // Add user modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addRole, setAddRole] = useState("student");
  const [addForm, setAddForm] = useState({
    registerNumber: "",
    facultyId: "",
    name: "",
    department: "",
    semester: "Odd",
    password: "",
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sumRes, stuRes, facRes, certRes] = await Promise.all([
        api.get("/admin/summary"),
        api.get("/students/all"),
        api.get("/admin/faculty"),
        api.get("/certificates/all"),
      ]);
      setSummary(sumRes.data);
      setStudents(stuRes.data);
      setFaculty(facRes.data);
      setCertificates(certRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const payload = { role: addRole, ...addForm };
      if (addRole === "faculty") {
        payload.facultyId = addForm.facultyId;
      }
      await api.post("/admin/add-user", payload);
      setShowAddModal(false);
      setAddForm({
        registerNumber: "",
        facultyId: "",
        name: "",
        department: "",
        semester: "Odd",
        password: "",
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add user");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteUser = async (role, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${role}?`)) return;
    try {
      await api.delete(`/admin/user/${role}/${id}`);
      fetchData();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-body)' }}>
        <div className="text-xl text-gray-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-body)' }}>
      {/* Top Header */}
      {/* Top Header */}
      <div className="header-wave-container topo-pattern pt-8 pb-20 px-8 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center border border-white/20">
              <Shield className="text-white" size={22} />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white">{user.name || "Admin"}</h1>
              <p className="text-xs text-sky-100">
                {user.department} • {user.institution}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/90 font-semibold hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition backdrop-blur-sm"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Wave Divider */}
        <div className="wave-divider-bottom">
           <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
             <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
           </svg>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b px-6">
        <div className="flex gap-1">
          {[
            { id: "summary", label: "Summary", icon: Building },
            { id: "students", label: "Students", icon: GraduationCap },
            { id: "faculty", label: "Faculty", icon: Users },
            { id: "certificates", label: "Certificates", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition ${
                activeTab === tab.id
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 -mt-8 relative z-20">
        {/* Summary */}
        {activeTab === "summary" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard label="Students" value={summary.totalStudents} color="sky" />
              <StatCard label="Faculty" value={summary.totalFaculty} color="indigo" />
              <StatCard label="Departments" value={summary.totalDepartments} color="purple" />
              <StatCard label="Pending" value={summary.pendingCerts} color="yellow" />
              <StatCard label="Approved" value={summary.approvedCerts} color="green" />
              <StatCard label="Rejected" value={summary.rejectedCerts} color="red" />
            </div>

            {/* Activity Points Rules */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Activity Point Rules (University)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-xl p-4 border-sky-200 bg-sky-50">
                  <h4 className="font-bold text-sky-700 mb-2">Group I (Max 40)</h4>
                  <p className="text-sm text-gray-600">
                    NSS/NCC/NSO, Arts, Sports, Games, Club Activities
                  </p>
                </div>
                <div className="border rounded-xl p-4 border-indigo-200 bg-indigo-50">
                  <h4 className="font-bold text-indigo-700 mb-2">Group II (Max 40)</h4>
                  <p className="text-sm text-gray-600">
                    Certifications, Internships, Workshops, Conferences, Hackathons
                  </p>
                </div>
                <div className="border rounded-xl p-4 border-purple-200 bg-purple-50">
                  <h4 className="font-bold text-purple-700 mb-2">Group III (Max 40)</h4>
                  <p className="text-sm text-gray-600">
                    Publications, Patents, Start-ups, Innovations, Skilling Certificates
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg">
                <strong>Total Required:</strong> 120 activity points (40 per group) are mandatory for graduation.
              </p>
            </div>
          </div>
        )}

        {/* Students */}
        {activeTab === "students" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Students ({students.length})
              </h2>
              <button
                onClick={() => {
                  setAddRole("student");
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition"
              >
                <Plus size={18} /> Add Student
              </button>
            </div>
            <div className="bg-white rounded-xl shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-gray-600">
                  <tr>
                    <th className="p-3 text-left">Reg No</th>
                    <th className="text-left">Name</th>
                    <th>Semester</th>
                    <th>Group I</th>
                    <th>Group II</th>
                    <th>Group III</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s._id} className="border-t hover:bg-slate-50">
                      <td className="p-3">{s.registerNumber}</td>
                      <td>{s.name}</td>
                      <td className="text-center">{s.semester}</td>
                      <td className="text-center">{s.activityPoints?.groupI || 0}</td>
                      <td className="text-center">{s.activityPoints?.groupII || 0}</td>
                      <td className="text-center">{s.activityPoints?.groupIII || 0}</td>
                      <td className="text-center font-semibold">{s.totalPointsEarned || 0}</td>
                      <td className="text-center">
                        <button
                          onClick={() => handleDeleteUser("student", s._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Faculty */}
        {activeTab === "faculty" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Faculty ({faculty.length})
              </h2>
              <button
                onClick={() => {
                  setAddRole("faculty");
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition"
              >
                <Plus size={18} /> Add Faculty
              </button>
            </div>
            <div className="bg-white rounded-xl shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-gray-600">
                  <tr>
                    <th className="p-3 text-left">Faculty ID</th>
                    <th className="text-left">Name</th>
                    <th className="text-left">Department</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {faculty.map((f) => (
                    <tr key={f._id} className="border-t hover:bg-slate-50">
                      <td className="p-3">{f.facultyId}</td>
                      <td>{f.name}</td>
                      <td>{f.department}</td>
                      <td className="text-center">
                        <button
                          onClick={() => handleDeleteUser("faculty", f._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Certificates */}
        {activeTab === "certificates" && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              All Certificates ({certificates.length})
            </h2>
            <div className="bg-white rounded-xl shadow divide-y">
              {certificates.map((cert) => (
                <div key={cert._id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{cert.title}</p>
                    <p className="text-sm text-gray-500">
                      {cert.studentId?.name} ({cert.studentId?.registerNumber}) •
                      Group {cert.group} • {cert.subCategory}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-sky-600">
                      {cert.pointsClaimed} pts
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        cert.status === "Approved"
                          ? "bg-green-100 text-green-600"
                          : cert.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {cert.status === "Approved" && <CheckCircle className="inline mr-1" size={12} />}
                      {cert.status === "Pending" && <Clock className="inline mr-1" size={12} />}
                      {cert.status === "Rejected" && <AlertCircle className="inline mr-1" size={12} />}
                      {cert.status}
                    </span>
                  </div>
                </div>
              ))}
              {certificates.length === 0 && (
                <p className="p-6 text-center text-gray-500">No certificates yet</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Add {addRole === "student" ? "Student" : "Faculty"}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <input
                placeholder="Full Name"
                className="w-full border rounded-xl px-4 py-3"
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                required
              />
              {addRole === "student" ? (
                <>
                  <input
                    placeholder="Register Number"
                    className="w-full border rounded-xl px-4 py-3"
                    value={addForm.registerNumber}
                    onChange={(e) =>
                      setAddForm({ ...addForm, registerNumber: e.target.value })
                    }
                    required
                  />
                  <select
                    className="w-full border rounded-xl px-4 py-3 bg-white"
                    value={addForm.semester}
                    onChange={(e) =>
                      setAddForm({ ...addForm, semester: e.target.value })
                    }
                  >
                    <option value="Odd">Odd Semester</option>
                    <option value="Even">Even Semester</option>
                  </select>
                </>
              ) : (
                <input
                  placeholder="Faculty ID"
                  className="w-full border rounded-xl px-4 py-3"
                  value={addForm.facultyId}
                  onChange={(e) =>
                    setAddForm({ ...addForm, facultyId: e.target.value })
                  }
                  required
                />
              )}
              <input
                placeholder="Department"
                className="w-full border rounded-xl px-4 py-3"
                value={addForm.department}
                onChange={(e) =>
                  setAddForm({ ...addForm, department: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border rounded-xl px-4 py-3"
                value={addForm.password}
                onChange={(e) =>
                  setAddForm({ ...addForm, password: e.target.value })
                }
                required
              />
              <button
                type="submit"
                disabled={adding}
                className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 disabled:opacity-50"
              >
                {adding ? "Adding..." : `Add ${addRole}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Stat Card ---------- */
function StatCard({ label, value, color }) {
  const colorMap = {
    sky: "text-sky-600 bg-sky-50 border-sky-200",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-200",
    purple: "text-purple-600 bg-purple-50 border-purple-200",
    yellow: "text-yellow-600 bg-yellow-50 border-yellow-200",
    green: "text-green-600 bg-green-50 border-green-200",
    red: "text-red-600 bg-red-50 border-red-200",
  };

  return (
    <div className={`rounded-xl p-5 border ${colorMap[color] || colorMap.sky}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${colorMap[color]?.split(" ")[0]}`}>
        {value || 0}
      </p>
    </div>
  );
}
