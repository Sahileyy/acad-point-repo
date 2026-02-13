import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  LogOut,
  CheckCircle,
  XCircle,
  Search,
  FileText,
  AlertTriangle,
  Eye,
  X,
} from "lucide-react";
import api from "../api/axios";

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user")) || {};

  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [filter, setFilter] = useState("all"); // all | pending | low
  const [loading, setLoading] = useState(true);

  // Modal
  const [selectedCert, setSelectedCert] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stuRes, certRes] = await Promise.all([
        api.get("/students/all"),
        api.get("/certificates/all"),
      ]);
      setStudents(stuRes.data);
      setCertificates(certRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const handleReview = async (status) => {
    if (!selectedCert) return;
    setReviewing(true);
    try {
      await api.put(`/certificates/${selectedCert._id}/review`, {
        status,
        remarks,
      });
      setSelectedCert(null);
      setRemarks("");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Review failed");
    } finally {
      setReviewing(false);
    }
  };

  const pendingCount = certificates.filter((c) => c.status === "Pending").length;
  const lowActivityStudents = students.filter((s) => s.totalPointsEarned < 60);

  // Filter and search students
  let filteredStudents = students;

  if (filter === "low") {
    filteredStudents = lowActivityStudents;
  }

  if (search) {
    filteredStudents = filteredStudents.filter(
      (s) =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.registerNumber?.includes(search)
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-body)' }}>
        <div className="text-xl text-gray-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-body)' }}>
      {/* Header */}
      <div className="header-wave-container topo-pattern pt-8 pb-24 px-8 text-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {user.name || "Faculty"}
            </h1>
            <p className="text-sky-100 mt-1">{user.department || ""} Department</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <Bell className="text-white cursor-pointer hover:text-sky-200 transition" />
              {pendingCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-sky-500">
                  {pendingCount}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white/90 font-semibold hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition backdrop-blur-sm"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="wave-divider-bottom">
           <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
             <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
           </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Pending Approvals"
          value={pendingCount}
          color="yellow"
        />
        <SummaryCard
          title="Low Activity Students"
          value={lowActivityStudents.length}
          color="red"
        />
        <SummaryCard title="Total Students" value={students.length} color="sky" />
        <SummaryCard
          title="Total Certificates"
          value={certificates.length}
          color="indigo"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        {[
          { id: "all", label: "All Students" },
          { id: "low", label: "Low Activity (<60 pts)" },
          { id: "pending", label: "Pending Certs" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              filter === f.id
                ? "bg-sky-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow p-4 mb-4 flex items-center gap-3">
        <Search className="text-gray-500" />
        <input
          placeholder="Search by name or register number"
          className="w-full outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Pending certificates view */}
      {filter === "pending" ? (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-4 border-b bg-yellow-50">
            <h3 className="font-bold text-gray-800">Pending Certificate Approvals</h3>
          </div>
          <div className="divide-y">
            {certificates
              .filter((c) => c.status === "Pending")
              .map((cert) => (
                <div
                  key={cert._id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <p className="font-semibold">{cert.title}</p>
                    <p className="text-sm text-gray-500">
                      {cert.studentId?.name} ({cert.studentId?.registerNumber}) •
                      Group {cert.group} • {cert.subCategory}
                    </p>
                    <p className="text-sm text-sky-600 font-semibold">
                      {cert.pointsClaimed} points requested
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="px-4 py-2 bg-sky-100 text-sky-600 rounded-lg font-semibold hover:bg-sky-200"
                  >
                    <Eye size={16} className="inline mr-1" />
                    Review
                  </button>
                </div>
              ))}
            {certificates.filter((c) => c.status === "Pending").length === 0 && (
              <p className="p-6 text-center text-gray-500">No pending certificates</p>
            )}
          </div>
        </div>
      ) : (
        /* Student Table */
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">Reg No</th>
                <th className="text-left">Name</th>
                <th className="text-left">Sem</th>
                <th className="text-center">Group I</th>
                <th className="text-center">Group II</th>
                <th className="text-center">Group III</th>
                <th className="text-center">Total</th>
                <th className="text-center">Pending</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s._id} className="border-t hover:bg-slate-50 transition">
                  <td className="p-3">{s.registerNumber}</td>
                  <td>{s.name}</td>
                  <td>{s.semester}</td>
                  <td className="text-center">{s.activityPoints?.groupI || 0}</td>
                  <td className="text-center">{s.activityPoints?.groupII || 0}</td>
                  <td className="text-center">{s.activityPoints?.groupIII || 0}</td>
                  <td className="text-center font-semibold">{s.totalPointsEarned || 0}</td>
                  <td className="text-center">
                    {s.pendingCertificates > 0 ? (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                        {s.pendingCertificates}
                      </span>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => {
                        setFilter("pending");
                      }}
                      className="text-sky-600 font-semibold hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Certificate Review</h2>
              <button
                onClick={() => setSelectedCert(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <p>
                <strong>Student:</strong> {selectedCert.studentId?.name} (
                {selectedCert.studentId?.registerNumber})
              </p>
              <p>
                <strong>Title:</strong> {selectedCert.title}
              </p>
              <p>
                <strong>Group:</strong> {selectedCert.group} —{" "}
                {selectedCert.subCategory}
              </p>
              <p>
                <strong>Points Claimed:</strong> {selectedCert.pointsClaimed}
              </p>
              {selectedCert.description && (
                <p>
                  <strong>Description:</strong> {selectedCert.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 mb-4">
              <FileText />
              <a
                href={`http://localhost:5000/${selectedCert.filePath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 underline"
              >
                View Uploaded Certificate
              </a>
            </div>

            <textarea
              placeholder="Remarks (optional)"
              className="w-full border rounded-lg p-3 mb-4"
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-200 disabled:opacity-50"
                disabled={reviewing}
                onClick={() => handleReview("Rejected")}
              >
                <XCircle size={18} /> Reject
              </button>
              <button
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-100 text-green-600 font-semibold hover:bg-green-200 disabled:opacity-50"
                disabled={reviewing}
                onClick={() => handleReview("Approved")}
              >
                <CheckCircle size={18} /> Approve
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

/* ---------- Summary Card ---------- */
function SummaryCard({ title, value, color }) {
  const bgClass =
    color === "yellow" ? "border-l-yellow-400" :
    color === "red" ? "border-l-red-400" :
    color === "sky" ? "border-l-sky-400" :
    "border-l-indigo-400";

  return (
    <div className={`bg-white rounded-xl shadow p-5 border-l-4 ${bgClass}`}>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
