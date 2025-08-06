import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withAuth from "@/utils/withAuth";
import MapDisplay from "@/components/MapDisplay";
import NotificationBell from "@/components/shared/NotificationBell";
import SettingsMenu from "@/components/shared/SettingsMenu";

const STATUS_COLORS = {
  'Pending Approval': 'bg-blue-200 text-blue-900',
  'Under Review': 'bg-yellow-100 text-yellow-900',
  'Resolved': 'bg-green-100 text-green-900',
  'Rejected': 'bg-red-100 text-red-900',
};

const PRIORITY_COLORS = {
  'Low': 'bg-gray-100 text-gray-800',
  'Medium': 'bg-blue-100 text-blue-800',
  'High': 'bg-orange-100 text-orange-800',
  'Critical': 'bg-red-100 text-red-800',
};

function ClerkIssueDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [updateText, setUpdateText] = useState("");
  const [showEscalation, setShowEscalation] = useState(false);
  const [escalationPriority, setEscalationPriority] = useState("High");
  const [escalationReason, setEscalationReason] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchIssueDetails();
    const intervalId = setInterval(fetchIssueDetails, 5000);
    return () => clearInterval(intervalId);
  }, [id]);

  const fetchIssueDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");
      const res = await fetch(`/api/issues/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setIssue(data.issue);
        setLoading(false);
        setMessage("");
        setNewStatus(prev => prev || data.issue.status);
      } else if ([401, 403].includes(res.status)) {
        router.push("/login");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching issue details:", err);
      setMessage("Failed to load issue");
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || !updateText.trim()) {
      setMessage("Please provide both status and update text");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/issues/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          updateText: updateText.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Issue updated successfully!");
        setUpdateText("");
        fetchIssueDetails();
      } else {
        setMessage(data.message || "Failed to update issue");
      }
    } catch (err) {
      setMessage("Error updating issue");
    }
  };

  const handleEscalation = async () => {
    if (!escalationReason.trim() || escalationReason.trim().length < 10) {
      setMessage("Please provide a detailed escalation reason (minimum 10 characters)");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/issues/${id}/escalate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          priority: escalationPriority,
          reason: escalationReason.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Issue escalated successfully!");
        setShowEscalation(false);
        setEscalationReason("");
        fetchIssueDetails();
      } else {
        setMessage(data.message || "Failed to escalate issue");
      }
    } catch (err) {
      setMessage("Error escalating issue");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfaf5] flex items-center justify-center">
        <div className="text-2xl font-bold text-orange-500">Loading...</div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-[#fdfaf5] flex items-center justify-center">
        <div className="text-2xl font-bold text-red-500">Issue not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-sans">
      <div className="w-2/3 bg-[#fdfaf5] p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-orange-500">Issue Details</h2>
          <div className="flex items-center gap-4 text-black">
            <NotificationBell />
            <SettingsMenu />
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg mb-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-gray-900">{issue.title}</h3>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[issue.status]}`}>
                {issue.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${PRIORITY_COLORS[issue.priority || 'Medium']}`}>
                {issue.priority || 'Medium'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="font-semibold">{issue.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-semibold">{issue.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Reported On</p>
              <p className="font-semibold">{new Date(issue.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="font-semibold">{new Date(issue.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Description</p>
            <p className="text-gray-900">{issue.description}</p>
          </div>

          {issue.images && issue.images.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Images</p>
              <div className="grid grid-cols-2 gap-4">
                {issue.images.map((image, idx) => (
                  <img
                    key={idx}
                    src={image}
                    alt={`Issue image ${idx + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Updates</p>
            <div className="space-y-3">
              {issue.updates && issue.updates.length > 0 ? (
                issue.updates.map((update, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[update.status]}`}>
                        {update.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(update.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-900">{update.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No updates yet</p>
              )}
            </div>
          </div>

          {issue.feedbacks?.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Feedback by client</h3>
              {issue.feedbacks.map((fb, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-300 mb-4">
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={`text-xl ${fb.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                    ))}
                  </div>
                  {fb.comment && <p className="text-gray-700">{fb.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-1/3 bg-black text-white p-12">
        <h2 className="text-[#FF9100] text-2xl font-bold mb-8">Update Issue</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
          >
            <option value="Pending Approval">Pending Approval</option>
            <option value="Under Review">Under Review</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Update Text</label>
          <textarea
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white h-32 resize-none"
            placeholder="Provide an update on this issue..."
          />
        </div>

        <button
          onClick={handleStatusUpdate}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg mb-4 transition"
        >
          Update Issue
        </button>

        {/* Escalation Section */}
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-xl font-bold mb-4 text-orange-500">Escalate Issue</h3>
          
          {!showEscalation ? (
            <button
              onClick={() => setShowEscalation(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition"
            >
              Escalate Issue
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Priority Level</label>
                <select
                  value={escalationPriority}
                  onChange={(e) => setEscalationPriority(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                >
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Escalation Reason</label>
                <textarea
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white h-24 resize-none"
                  placeholder="Provide a detailed reason for escalation (minimum 10 characters)..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleEscalation}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Confirm Escalation
                </button>
                <button
                  onClick={() => {
                    setShowEscalation(false);
                    setEscalationReason("");
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {message && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <p className="text-green-400">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(ClerkIssueDetailsPage, ["clerk"]);
