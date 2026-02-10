import { useState } from "react";
import {
  Bell,
  LogOut,
  CheckCircle,
  XCircle,
  Search,
  FileText
} from "lucide-react";

export default function FacultyDashboard() {
  const faculty = JSON.parse(localStorage.getItem("faculty")) || {
    name: "Dr. Rajesh Kumar",
    department: "Computer Science"
  };

  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Sample data (replace with backend later)
  const students = [
    {
      regNo: "21CS045",
      name: "Kavya",
      semester: 5,
      groupI: 32,
      groupII: 28,
      groupIII: 20,
      total: 80,
      status: "Pending"
    },
    {
      regNo: "21CS032",
      name: "Arjun",
      semester: 5,
      groupI: 40,
      groupII: 38,
      groupIII: 35,
      total: 113,
      status: "Approved"
    }
  ];

  const filteredStudents = students.filter(
    s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.regNo.includes(search)
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {faculty.name}
          </h1>
          <p className="text-gray-500">{faculty.department} Department</p>
        </div>

        <div className="flex gap-4 items-center">
          <Bell className="text-gray-600 cursor-pointer" />
          <button className="flex items-center gap-2 text-red-600 font-semibold">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Pending Approvals" value="12" />
        <SummaryCard title="Low Activity Students" value="18" />
        <SummaryCard title="Total Students" value="120" />
        <SummaryCard title="Deadlines This Week" value="3" />
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

      {/* Student Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-gray-600">
            <tr>
              <th className="p-3">Reg No</th>
              <th>Name</th>
              <th>Sem</th>
              <th>Group I</th>
              <th>Group II</th>
              <th>Group III</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((s, i) => (
              <tr
                key={i}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="p-3">{s.regNo}</td>
                <td>{s.name}</td>
                <td>{s.semester}</td>
                <td>{s.groupI}</td>
                <td>{s.groupII}</td>
                <td>{s.groupIII}</td>
                <td className="font-semibold">{s.total}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      s.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => setSelectedStudent(s)}
                    className="text-sky-600 font-semibold"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Certificate Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-2">
              Certificate Review
            </h2>
            <p className="text-gray-600 mb-4">
              {selectedStudent.name} ({selectedStudent.regNo})
            </p>

            <div className="flex items-center gap-3 mb-6">
              <FileText />
              <a
                href="#"
                className="text-sky-600 underline"
              >
                View Uploaded Certificate
              </a>
            </div>

            <textarea
              placeholder="Remarks (optional)"
              className="w-full border rounded-lg p-3 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-600"
                onClick={() => setSelectedStudent(null)}
              >
                <XCircle size={18} /> Reject
              </button>

              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-600"
                onClick={() => setSelectedStudent(null)}
              >
                <CheckCircle size={18} /> Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Components ---------- */

const SummaryCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow p-5">
    <p className="text-sm text-gray-500 mb-1">{title}</p>
    <p className="text-3xl font-bold text-sky-600">{value}</p>
  </div>
);
