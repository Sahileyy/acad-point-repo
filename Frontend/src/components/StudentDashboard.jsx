import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Upload,
  Award,
  LogOut,
  Menu,
  X,
  TrendingUp,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import api from "../api/axios";

/* ============================
   Sub-category options per group
============================ */
const GROUP_OPTIONS = {
  I: [
    "NSS",
    "NCC",
    "NSO",
    "Arts",
    "Sports",
    "Games",
    "Club Activities",
  ],
  II: [
    "English Certification",
    "Aptitude Certification",
    "Internship (min 2 weeks)",
    "Workshop",
    "Conference",
    "Paper Presentation",
    "Hackathon",
  ],
  III: [
    "Journal Publication",
    "Patent",
    "Start-up",
    "Innovation",
    "National/International Hackathon Winner",
    "University Skilling Certificate",
  ],
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data
  const [profile, setProfile] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload form
  const [uploadGroup, setUploadGroup] = useState("");
  const [uploadForm, setUploadForm] = useState({
    subCategory: "",
    title: "",
    description: "",
    pointsClaimed: "",
  });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, certsRes] = await Promise.all([
        api.get("/students/profile"),
        api.get("/certificates/my"),
      ]);
      setProfile(profileRes.data);
      setCertificates(certsRes.data);
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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return alert("Please select a file");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("certificate", uploadFile);
      formData.append("group", uploadGroup);
      formData.append("subCategory", uploadForm.subCategory);
      formData.append("title", uploadForm.title);
      formData.append("description", uploadForm.description);
      formData.append("pointsClaimed", uploadForm.pointsClaimed);

      await api.post("/certificates/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowUploadModal(false);
      setUploadForm({ subCategory: "", title: "", description: "", pointsClaimed: "" });
      setUploadFile(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const openUploadModal = (group) => {
    setUploadGroup(group);
    setUploadForm({ subCategory: "", title: "", description: "", pointsClaimed: "" });
    setUploadFile(null);
    setShowUploadModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100">
        <div className="text-xl text-gray-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  const totalEarned = profile?.totalPointsEarned || 0;
  const totalRequired = profile?.totalPointsRequired || 120;
  const progress = totalRequired > 0 ? Math.round((totalEarned / totalRequired) * 100) : 0;
  const gI = profile?.activityPoints?.groupI || 0;
  const gII = profile?.activityPoints?.groupII || 0;
  const gIII = profile?.activityPoints?.groupIII || 0;

  const getGroupCerts = (group) =>
    certificates.filter((c) => c.group === group);

  const getPendingCount = (group) =>
    certificates.filter((c) => c.group === group && c.status === "Pending").length;

  /* ---------- SIDEBAR ---------- */
  const Sidebar = () => (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-white border-r border-slate-200 transition-all duration-300 flex flex-col h-screen sticky top-0 z-50`}
    >
      <div className="p-6 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-sky-400 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Award className="text-white" size={24} />
          </div>
          {sidebarOpen && (
            <div>
              <h2 className="font-bold text-gray-800">Activity Portal</h2>
              <p className="text-xs text-gray-500">Student System</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4">
        {[
          { id: "profile", icon: User, label: "Profile" },
          { id: "group1", icon: Award, label: "Group I" },
          { id: "group2", icon: FileText, label: "Group II" },
          { id: "group3", icon: TrendingUp, label: "Group III" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 sidebar-link ${
              activeTab === item.id
                ? "active"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <item.icon size={20} />
            {sidebarOpen && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-sky-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300"
        >
          <LogOut size={20} />
          {sidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  /* ---------- PROFILE TAB ---------- */
  const ProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-sky-100">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {profile?.name?.charAt(0) || "S"}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {profile?.name}
            </h2>
            <p className="text-gray-600">{profile?.registerNumber}</p>
            <span className="inline-block mt-2 px-4 py-1 bg-sky-100 text-sky-600 rounded-full text-sm font-semibold">
              Semester: {profile?.semester}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 border border-sky-100">
            <p className="text-sm text-gray-600 mb-2">Total Points Earned</p>
            <p className="text-4xl font-bold text-sky-600">{totalEarned}</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-6 border border-cyan-100">
            <p className="text-sm text-gray-600 mb-2">Points Required</p>
            <p className="text-4xl font-bold text-cyan-600">{totalRequired}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <p className="text-sm text-gray-600 mb-2">Progress</p>
            <p className="text-4xl font-bold text-blue-600">{progress}%</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700">
              Overall Progress
            </span>
            <span className="text-sm font-bold text-sky-600">
              {totalEarned}/{totalRequired}
            </span>
          </div>
          <div className="progress-bar w-full h-4">
            <div
              className="progress-fill h-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Group Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Group I – Co-curricular", val: gI, color: "sky", group: "I" },
          { label: "Group II – Skill Dev", val: gII, color: "cyan", group: "II" },
          { label: "Group III – Research", val: gIII, color: "blue", group: "III" },
        ].map((g) => (
          <div
            key={g.group}
            className="bg-white rounded-2xl p-6 shadow-lg border border-sky-100"
          >
            <h3 className="font-bold text-gray-800 mb-4">{g.label}</h3>
            <div className="flex justify-between items-center mb-3">
              <span className={`text-2xl font-bold text-${g.color}-600`}>
                {g.val}/40
              </span>
              <span className="text-sm text-gray-500">Points</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full bg-${g.color}-400 rounded-full`}
                style={{ width: `${(g.val / 40) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              {getPendingCount(g.group)} pending approvals
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  /* ---------- GROUP TAB ---------- */
  const GroupTab = ({ group, groupName, description }) => {
    const certs = getGroupCerts(group);
    const earned =
      group === "I" ? gI : group === "II" ? gII : gIII;

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-sky-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{groupName}</h2>
          <p className="text-gray-600 mb-6">{description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-sky-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">Earned Points</p>
              <p className="text-2xl font-bold text-sky-600">{earned}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">Maximum Points</p>
              <p className="text-2xl font-bold text-blue-600">40</p>
            </div>
            <div className="bg-cyan-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-cyan-600">
                {getPendingCount(group)}
              </p>
            </div>
          </div>

          <button
            onClick={() => openUploadModal(group)}
            className="w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Upload size={20} />
            Upload Certificate
          </button>
        </div>

        {/* Certificate List */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-sky-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Uploaded Certificates
          </h3>
          {certs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No certificates uploaded yet
            </p>
          ) : (
            <div className="space-y-3">
              {certs.map((cert) => (
                <div
                  key={cert._id}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {cert.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {cert.subCategory} •{" "}
                        {new Date(cert.createdAt).toLocaleDateString()}
                      </p>
                      {cert.remarks && (
                        <p className="text-xs text-gray-500 mt-1 italic">
                          Remarks: {cert.remarks}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-sky-600">
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
                        {cert.status === "Approved" && (
                          <CheckCircle className="inline mr-1" size={12} />
                        )}
                        {cert.status === "Pending" && (
                          <Clock className="inline mr-1" size={12} />
                        )}
                        {cert.status === "Rejected" && (
                          <AlertCircle className="inline mr-1" size={12} />
                        )}
                        {cert.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };



  /* ---------- RENDER ---------- */
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100">
      <Sidebar />

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-600 hover:bg-sky-50 transition-all duration-300 lg:hidden"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="flex-1 overflow-auto bg-slate-50 relative">
        {/* Topographic Wave Header */}
        <div className="header-wave-container topo-pattern pt-8 pb-20 px-8 text-white">
          <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
            <div>
              <h1 className="text-3xl font-bold">Student Dashboard</h1>
              <p className="text-sky-100 mt-1">Manage your activity points and certificates</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20">
               <span className="font-mono text-sm">Sem: {profile?.semester || "..."}</span>
            </div>
          </div>
          
           {/* Wave Divider */}
           <div className="wave-divider-bottom">
             <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
               <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
             </svg>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 pb-12 -mt-10 relative z-10">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "group1" && (
            <GroupTab
              group="I"
              groupName="Group I"
              description="NSS/NCC/NSO, Arts, Sports, Games, and Club Activities"
            />
          )}
          {activeTab === "group2" && (
            <GroupTab
              group="II"
              groupName="Group II"
              description="Certifications, Internships, Workshops, Conferences, Paper Presentations, Hackathons"
            />
          )}
          {activeTab === "group3" && (
            <GroupTab
              group="III"
              groupName="Group III"
              description="Journal Publications, Patents, Start-ups, Innovations, National/International Hackathon Winners"
            />
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Upload Certificate — Group {uploadGroup}
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <select
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white"
                value={uploadForm.subCategory}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, subCategory: e.target.value })
                }
                required
              >
                <option value="">Select Sub-Category</option>
                {GROUP_OPTIONS[uploadGroup]?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              <input
                placeholder="Certificate Title"
                className="w-full border border-gray-200 rounded-xl px-4 py-3"
                value={uploadForm.title}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, title: e.target.value })
                }
                required
              />

              <textarea
                placeholder="Description (optional)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3"
                rows={2}
                value={uploadForm.description}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, description: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Points Claimed (1-40)"
                min={1}
                max={40}
                className="w-full border border-gray-200 rounded-xl px-4 py-3"
                value={uploadForm.pointsClaimed}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, pointsClaimed: e.target.value })
                }
                required
              />

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Upload File (JPG, PNG, or PDF — max 5MB)
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Submit Certificate"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}