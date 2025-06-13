// pages/clerk/dashboard.js
import { useState, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/router";

export default function ClerkDashboard() {
  const router = useRouter();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/issues/assigned", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setIssues(data.issues || []);
      } catch (err) {
        console.error("Failed to fetch clerk issues:", err);
      }
    };
    fetchIssues();
  }, []);

  const grouped = issues.reduce(
    (acc, issue) => {
      if (!acc[issue.status]) acc[issue.status] = [];
      acc[issue.status].push(issue);
      return acc;
    },
    { "Pending Approval": [], "Under Review": [], Resolved: [], Rejected: [] }
  );

  const stats = {
    total: issues.length,
    "Pending Approval": grouped["Pending Approval"].length,
    "Under Review": grouped["Under Review"].length,
    Resolved: grouped.Resolved.length,
    Rejected: grouped.Rejected.length,
  };

  const statusColor = {
    "Pending Approval": "#d1ecf1",
    "Under Review": "#fdf8d7",
    Resolved: "#d4edda",
    Rejected: "#f8d7da",
  };

  const renderSection = (status) => (
    <div key={status} className="mb-6">
      <div
        className="text-lg font-medium mb-3 px-3 py-1 rounded"
        style={{ backgroundColor: statusColor[status], borderRadius: 8 }}
      >
        {status}
      </div>
      {(grouped[status] || []).map((issue) => (
        <div
          key={issue._id}
          onClick={() => router.push(`/clerk/issues/${issue._id}`)}
          className="cursor-pointer bg-white p-4 mt-2 rounded-xl shadow-md flex justify-between items-center hover:shadow-lg"
        >
          <div>
            <h4 className="font-bold text-black">{issue.title}</h4>
            <p className="text-sm text-gray-600">
              Filed on: {new Date(issue.createdAt).toLocaleDateString()}
            </p>
          </div>
          <FiArrowRight size={20} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen font-sans">
      {/* Left: Issue List */}
      <div className="w-2/3 bg-[#fdfaf5] p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-orange-500">Clerk Dashboard</h2>
          <div className="flex items-center gap-4 text-black">
            <span className="text-2xl">🔔</span>
            <span className="text-2xl">⚙️</span>
          </div>
        </div>

        {renderSection("Pending Approval")}
        {renderSection("Under Review")}
        {renderSection("Resolved")}
        {renderSection("Rejected")}
      </div>

      {/* Right: Statistics */}
      <div className="w-1/3 bg-black text-white p-12">
        <h3 className="text-3xl font-bold text-orange-500 mb-8">Statistics</h3>
        <div className="grid grid-cols-2 gap-y-8 text-lg">
          <div>
            <p>Total Issues</p>
            <p className="font-bold text-2xl">{stats.total}</p>
          </div>
          <div>
            <p>Pending Approval</p>
            <p className="font-bold text-2xl">{stats["Pending Approval"]}</p>
          </div>
          <div>
            <p>Under Review</p>
            <p className="font-bold text-2xl">{stats["Under Review"]}</p>
          </div>
          <div>
            <p>Resolved</p>
            <p className="font-bold text-2xl">{stats.Resolved}</p>
          </div>
          <div>
            <p>Rejected</p>
            <p className="font-bold text-2xl">{stats.Rejected}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
