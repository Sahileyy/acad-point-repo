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
  Briefcase,
  BookOpen,
} from "lucide-react";
import api from "../api/axios";

/* ============================
   Sub-category options
============================ */
const GROUP_OPTIONS = {
  I: [
    "NSS", "NCC", "NSO", "Arts", "Sports", "Games", "Club Activities",
  ],
  II: [
    "English Certification", "Aptitude Certification", "Internship",
    "Workshop", "Conference", "Paper Presentation", "Hackathon",
  ],
  III: [
    "Journal Publication", "Patent", "Start-up", "Innovation",
    "Hackathon Winner", "University Skilling Certificate",
  ],
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data
  const [profile, setProfile] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload form
  const [uploadGroup, setUploadGroup] = useState("");
  const [uploadForm, setUploadForm] = useState({
    subCategory: "", title: "", description: "", pointsClaimed: "",
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
    sessionStorage.clear();
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-gray-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const totalEarned = profile?.totalPointsEarned || 0;
  const totalRequired = profile?.totalPointsRequired || 120;
  const progress = totalRequired > 0 ? Math.round((totalEarned / totalRequired) * 100) : 0;
  
  const gI = profile?.activityPoints?.groupI || 0;
  const gII = profile?.activityPoints?.groupII || 0;
  const gIII = profile?.activityPoints?.groupIII || 0;

  const getGroupCerts = (group) => certificates.filter((c) => c.group === group);
  const getPendingCount = (group) => certificates.filter((c) => c.group === group && c.status === "Pending").length;

  /* ---------- SIDEBAR (FIXED) ---------- */
  const Sidebar = () => (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white/80 backdrop-blur-xl border-r border-slate-100 flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-sm ${
           mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="h-24 flex items-center px-8 border-b border-slate-100/50">
           <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-200">A</div>
              <span className="font-bold text-xl tracking-tight text-slate-800">ACAD<span className="text-sky-600">POINT</span></span>
           </div>
           {/* Close button for mobile */}
           <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="lg:hidden ml-auto p-2 text-slate-400"
           >
              <X size={20} />
           </button>
        </div>

        <nav className="flex-1 p-5 space-y-2 overflow-y-auto mt-2">
          {[
            { id: "profile", icon: User, label: "Overview" },
            { id: "group1", icon: Award, label: "Co-curricular" },
            { id: "group2", icon: Briefcase, label: "Skill Dev" },
            { id: "group3", icon: BookOpen, label: "Research" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`group relative w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? "bg-sky-50 text-sky-600 shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className={`transition-transform duration-200 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                 <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 1.5} />
              </div>
              <span className="font-medium text-[15px]">{item.label}</span>
              
              {activeTab === item.id && (
                 <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-5 border-t border-slate-100/50">
          <button
            onClick={handleLogout}
            className="group w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50/50 transition-all duration-200"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium text-[15px]">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );

  /* ---------- PROFILE TAB ---------- */
  const ProfileTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Main Profile Card - OVERLAPPING WAVE */}
      <div className="pro-card-floating p-8 -mt-24 flex flex-col md:flex-row items-center md:items-start gap-8 bg-white/90 backdrop-blur-sm">
         <div className="w-24 h-24 bg-gradient-to-br from-sky-100 to-slate-100 rounded-full flex items-center justify-center text-3xl font-bold text-sky-600 shadow-inner ring-4 ring-white">
            {profile?.name?.charAt(0) || "U"}
         </div>
         <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-800">{profile?.name}</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-slate-500 mb-6">
               <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-slate-600">{profile?.registerNumber}</span>
               <span className="text-slate-300">•</span>
               <span>Semester {profile?.semester}</span>
               <span className="text-slate-300">•</span>
               <span>{profile?.department || "CSE"}</span>
            </div>
            
            <div className="w-full">
              <div className="flex justify-between items-end mb-2">
                 <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Progress</span>
                 <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-sky-600">{progress}%</span>
                    <span className="text-xs text-slate-400 font-medium">COMPLETED</span>
                 </div>
              </div>
              <div className="progress-container h-4 bg-slate-100 shadow-inner">
                 <div className="progress-fill bg-gradient-to-r from-sky-500 to-sky-600" style={{ width: `${Math.min(progress, 100)}%` }}></div>
              </div>
              <p className="text-xs text-slate-400 mt-2 text-right font-medium">{totalEarned} earned / {totalRequired} required</p>
            </div>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Group I", sub: "Co-curricular", val: gI, icon: Award, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Group II", sub: "Skill Dev", val: gII, icon: Briefcase, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Group III", sub: "Research", val: gIII, icon: BookOpen, color: "text-purple-500", bg: "bg-purple-50" },
        ].map((g) => (
          <div key={g.label} className="pro-card p-6 flex items-start justify-between hover:shadow-lg transition-all cursor-default">
             <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{g.sub}</p>
                <div className="mt-2 flex items-baseline gap-1">
                   <span className="text-4xl font-bold text-slate-800">{g.val}</span>
                   <span className="text-sm text-slate-400 font-medium">/ 40</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getPendingCount(g.label.split(" ")[1]) > 0 ? 'bg-amber-400' : 'bg-slate-200'}`}></span>
                    <p className="text-xs text-slate-500 font-medium">{getPendingCount(g.label.split(" ")[1])} pending approval</p>
                </div>
             </div>
             <div className={`p-3.5 rounded-2xl ${g.bg} bg-opacity-50`}>
                <g.icon className={g.color} size={28} strokeWidth={1.5} />
             </div>
          </div>
        ))}
      </div>

    </div>
  );

  /* ---------- GROUP TAB ---------- */
  const GroupTab = ({ group, groupName, description }) => {
    const certs = getGroupCerts(group);
    const earned = group === "I" ? gI : group === "II" ? gII : gIII;

    return (
      <div className="space-y-6 -mt-24 relative z-20 animate-in fade-in slide-in-from-bottom-4 duration-500"> {/* Negative margins to overlap header */}
        
        {/* Header Card */}
        <div className="pro-card p-8 bg-white/95 backdrop-blur-sm">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                 <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-slate-800">{groupName}</h2>
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                         earned >= 40 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-sky-50 text-sky-600 border-sky-100'
                    }`}>
                        {earned >= 40 ? 'COMPLETED' : 'IN PROGRESS'}
                    </span>
                 </div>
                 <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">{description}</p>
                 <div className="mt-6 flex items-center gap-6 text-sm">
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-400 uppercase">Earned</span>
                        <span className="text-lg font-bold text-slate-800">{earned}/40</span>
                    </div>
                    <div className="w-px h-8 bg-slate-100"></div>
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-400 uppercase">Pending</span>
                        <span className="text-lg font-bold text-amber-500">{getPendingCount(group)}</span>
                    </div>
                 </div>
              </div>
              <button
                onClick={() => openUploadModal(group)}
                className="btn-primary flex items-center gap-2 shadow-lg shadow-sky-200/50 px-6 py-3"
              >
                <Upload size={18} />
                <span>Upload Certificate</span>
              </button>
           </div>
        </div>

        {/* Certificate Table/List */}
        <div className="pro-card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
             <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Activity Logs</h3>
             <span className="text-xs font-medium text-slate-400">{certs.length} Entries</span>
          </div>
          
          {certs.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
               <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={24} className="opacity-40" />
               </div>
               <p className="text-slate-500 font-medium">No certificates uploaded yet</p>
               <p className="text-xs text-slate-400 mt-1">Upload a certificate to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {certs.map((cert) => (
                <div key={cert._id} className="p-5 hover:bg-slate-50/80 transition-colors flex items-center justify-between group">
                   <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-sky-500 shadow-sm">
                         <FileText size={20} strokeWidth={1.5} />
                      </div>
                      <div>
                         <h4 className="font-semibold text-slate-800 text-sm md:text-base">{cert.title}</h4>
                         <p className="text-xs text-slate-500 mt-1">{cert.subCategory}</p>
                         {cert.remarks && (
                            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1.5 bg-red-50 px-2 py-1 rounded-md inline-flex">
                               <AlertCircle size={10} /> {cert.remarks}
                            </p>
                         )}
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-4 md:gap-8">
                      <div className="text-right hidden sm:block">
                          <span className="block text-sm font-bold text-slate-700">{cert.pointsClaimed} pts</span>
                          <span className="text-xs text-slate-400">{new Date(cert.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${
                          cert.status === "Approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          cert.status === "Pending" ? "bg-amber-50 text-amber-600 border-amber-100" :
                          "bg-red-50 text-red-600 border-red-100"
                      }`}>
                          {cert.status === "Approved" && <CheckCircle size={12} />}
                          {cert.status === "Pending" && <Clock size={12} />}
                          {cert.status === "Rejected" && <X size={12} />}
                          <span className="uppercase tracking-wider text-[10px]">{cert.status}</span>
                      </span>
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
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1 overflow-auto bg-slate-50 relative">
        {/* Header with Deep Indigo/Slate Gradient */}
        <div className="topo-pattern header-wave-container pt-12 pb-32 px-4 md:px-8 text-white">
          <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Student Dashboard</h1>
                <p className="text-sky-200 mt-1 font-light opacity-90">Manage your activity points</p>
             </div>
             <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-sm font-medium text-sky-50">Active Session</span>
             </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-6 pb-12 relative z-10 transition-all duration-300">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "group1" && <GroupTab group="I" groupName="Group I" description="Co-curricular Activities (NSS, NCC, Sports, etc.)" />}
          {activeTab === "group2" && <GroupTab group="II" groupName="Group II" description="Skill Development (Certifications, Internships, etc.)" />}
          {activeTab === "group3" && <GroupTab group="III" groupName="Group III" description="Research & Innovation (Publications, Patents, etc.)" />}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-0 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-100">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                  <h2 className="text-lg font-bold text-slate-800">Upload Certificate</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Group {uploadGroup}</p>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-700 bg-slate-50 p-2 rounded-full hover:bg-slate-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-5 bg-slate-50/30">
              <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                        <select
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all bg-white shadow-sm"
                          value={uploadForm.subCategory}
                          onChange={(e) => setUploadForm({ ...uploadForm, subCategory: e.target.value })}
                          required
                        >
                          <option value="">Select Category</option>
                          {GROUP_OPTIONS[uploadGroup]?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                     </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Certificate Title</label>
                    <input
                      placeholder="e.g. AWS Cloud Practitioner"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all bg-white shadow-sm"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      required
                    />
                  </div>
    
                  <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                        <textarea
                          placeholder="Optional details..."
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all bg-white shadow-sm resize-none"
                          rows={1}
                          value={uploadForm.description}
                          onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Points</label>
                        <input
                          type="number"
                          min={1}
                          max={40}
                          placeholder="Max 40"
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all bg-white shadow-sm"
                          value={uploadForm.pointsClaimed}
                          onChange={(e) => setUploadForm({ ...uploadForm, pointsClaimed: e.target.value })}
                          required
                        />
                      </div>
                  </div>
    
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Proof Document</label>
                     <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-white hover:border-sky-400 transition-colors relative cursor-pointer bg-slate-50/50 group">
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={(e) => setUploadFile(e.target.files[0])}
                          required
                        />
                        <div className="flex flex-col items-center">
                           <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                              <Upload size={20} className="text-sky-500" />
                           </div>
                           <p className="text-sm text-slate-700 font-semibold">{uploadFile ? uploadFile.name : "Click to upload file"}</p>
                           <p className="text-xs text-slate-400 mt-1">PDF, JPG or PNG (Max 5MB)</p>
                        </div>
                     </div>
                  </div>
              </div>

              <div className="pt-2">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full btn-primary py-3.5 rounded-xl shadow-lg shadow-sky-200 font-bold tracking-wide text-sm uppercase"
                  >
                    {uploading ? "Uploading..." : "Submit Certificate"}
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}