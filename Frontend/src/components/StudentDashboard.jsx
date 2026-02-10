import React, { useState } from 'react';
import { 
  LayoutDashboard,
  User,
  Upload,
  Award,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Target,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

export default function StudentDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    setUser(null);
  };

  // Sample student data
  const studentData = {
    name: user?.user?.name || 'Student Name',
    registerNumber: user?.user?.id || 'REG12345',
    semester: 'Odd',
    totalPointsEarned: 85,
    totalPointsRequired: 120,
    progressPercentage: 70.8,
    groups: {
      groupI: { earned: 32, max: 40, pending: 2 },
      groupII: { earned: 28, max: 40, pending: 1 },
      groupIII: { earned: 25, max: 40, pending: 0 }
    }
  };

  const certificates = {
    groupI: [
      { id: 1, name: 'NSS Certificate', points: 10, status: 'Approved', date: '2024-01-15' },
      { id: 2, name: 'Sports Event', points: 12, status: 'Pending', date: '2024-01-20' },
    ],
    groupII: [
      { id: 3, name: 'Internship Certificate', points: 15, status: 'Approved', date: '2024-01-10' },
      { id: 4, name: 'Workshop Participation', points: 8, status: 'Rejected', date: '2024-01-18' },
    ],
    groupIII: [
      { id: 5, name: 'Research Paper', points: 20, status: 'Approved', date: '2024-01-05' },
    ]
  };

  const Sidebar = () => (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-sky-100 transition-all duration-300 flex flex-col h-screen sticky top-0`}>
      {/* Logo */}
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

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <button
          onClick={() => setActiveTab('profile')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-2 ${
            activeTab === 'profile'
              ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-lg'
              : 'text-gray-600 hover:bg-sky-50'
          }`}
        >
          <User size={20} />
          {sidebarOpen && <span className="font-medium">Profile</span>}
        </button>

        <button
          onClick={() => setActiveTab('group1')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-2 ${
            activeTab === 'group1'
              ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-lg'
              : 'text-gray-600 hover:bg-sky-50'
          }`}
        >
          <Award size={20} />
          {sidebarOpen && <span className="font-medium">Group I</span>}
        </button>

        <button
          onClick={() => setActiveTab('group2')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-2 ${
            activeTab === 'group2'
              ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-lg'
              : 'text-gray-600 hover:bg-sky-50'
          }`}
        >
          <FileText size={20} />
          {sidebarOpen && <span className="font-medium">Group II</span>}
        </button>

        <button
          onClick={() => setActiveTab('group3')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-2 ${
            activeTab === 'group3'
              ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-lg'
              : 'text-gray-600 hover:bg-sky-50'
          }`}
        >
          <TrendingUp size={20} />
          {sidebarOpen && <span className="font-medium">Group III</span>}
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-2 ${
            activeTab === 'dashboard'
              ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-lg'
              : 'text-gray-600 hover:bg-sky-50'
          }`}
        >
          <LayoutDashboard size={20} />
          {sidebarOpen && <span className="font-medium">Dashboard</span>}
        </button>
      </nav>

      {/* Logout */}
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

  const ProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-sky-100">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {studentData.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{studentData.name}</h2>
            <p className="text-gray-600">{studentData.registerNumber}</p>
            <span className="inline-block mt-2 px-4 py-1 bg-sky-100 text-sky-600 rounded-full text-sm font-semibold">
              Semester: {studentData.semester}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 border border-sky-100">
            <p className="text-sm text-gray-600 mb-2">Total Points Earned</p>
            <p className="text-4xl font-bold text-sky-600">{studentData.totalPointsEarned}</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-6 border border-cyan-100">
            <p className="text-sm text-gray-600 mb-2">Points Required</p>
            <p className="text-4xl font-bold text-cyan-600">{studentData.totalPointsRequired}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <p className="text-sm text-gray-600 mb-2">Progress</p>
            <p className="text-4xl font-bold text-blue-600">{studentData.progressPercentage}%</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
            <span className="text-sm font-bold text-sky-600">{studentData.totalPointsEarned}/{studentData.totalPointsRequired}</span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${studentData.progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Group Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-sky-100">
          <h3 className="font-bold text-gray-800 mb-4">Group I - Co-curricular</h3>
          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl font-bold text-sky-600">{studentData.groups.groupI.earned}/{studentData.groups.groupI.max}</span>
            <span className="text-sm text-gray-500">Points</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-sky-400 rounded-full"
              style={{ width: `${(studentData.groups.groupI.earned / studentData.groups.groupI.max) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">{studentData.groups.groupI.pending} pending approvals</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-sky-100">
          <h3 className="font-bold text-gray-800 mb-4">Group II - Skill Development</h3>
          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl font-bold text-cyan-600">{studentData.groups.groupII.earned}/{studentData.groups.groupII.max}</span>
            <span className="text-sm text-gray-500">Points</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-cyan-400 rounded-full"
              style={{ width: `${(studentData.groups.groupII.earned / studentData.groups.groupII.max) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">{studentData.groups.groupII.pending} pending approvals</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-sky-100">
          <h3 className="font-bold text-gray-800 mb-4">Group III - Research</h3>
          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl font-bold text-blue-600">{studentData.groups.groupIII.earned}/{studentData.groups.groupIII.max}</span>
            <span className="text-sm text-gray-500">Points</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-blue-400 rounded-full"
              style={{ width: `${(studentData.groups.groupIII.earned / studentData.groups.groupIII.max) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">{studentData.groups.groupIII.pending} pending approvals</p>
        </div>
      </div>
    </div>
  );

  const GroupTab = ({ groupName, groupData, description }) => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-sky-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{groupName}</h2>
        <p className="text-gray-600 mb-6">{description}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-sky-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">Earned Points</p>
            <p className="text-2xl font-bold text-sky-600">{groupData.earned}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">Maximum Points</p>
            <p className="text-2xl font-bold text-blue-600">{groupData.max}</p>
          </div>
          <div className="bg-cyan-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-cyan-600">{groupData.pending}</p>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
          <Upload size={20} />
          Upload Certificate
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-sky-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Uploaded Certificates</h3>
        <div className="space-y-3">
          {certificates[groupName === 'Group I' ? 'groupI' : groupName === 'Group II' ? 'groupII' : 'groupIII'].map((cert) => (
            <div key={cert.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{cert.name}</h4>
                  <p className="text-sm text-gray-500">{cert.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-sky-600">{cert.points} pts</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    cert.status === 'Approved' ? 'bg-green-100 text-green-600' :
                    cert.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {cert.status === 'Approved' && <CheckCircle className="inline mr-1" size={12} />}
                    {cert.status === 'Pending' && <Clock className="inline mr-1" size={12} />}
                    {cert.status === 'Rejected' && <AlertCircle className="inline mr-1" size={12} />}
                    {cert.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100">
      <Sidebar />

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-600 hover:bg-sky-50 transition-all duration-300 lg:hidden"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'group1' && <GroupTab groupName="Group I" groupData={studentData.groups.groupI} description="NSS/NCC/NSO, Arts, Sports, Games, and Club Activities" />}
          {activeTab === 'group2' && <GroupTab groupName="Group II" groupData={studentData.groups.groupII} description="Certifications, Internships, Workshops, Conferences, Paper Presentations, Hackathons" />}
          {activeTab === 'group3' && <GroupTab groupName="Group III" groupData={studentData.groups.groupIII} description="Journal Publications, Patents, Start-ups, Innovations, National/International Hackathon Winners" />}
          {activeTab === 'dashboard' && <ProfileTab />}
        </div>
      </div>
    </div>
  );
}