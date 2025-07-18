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

function ClerkIssueDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [updateText, setUpdateText] = useState("");

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
  // Only set newStatus if it's the first fetch (status not set yet)
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

  const handleUpdateStatus = async () => {
    setMessage("");
    if (!updateText.trim()) return setMessage("Please provide an update description");
    if (!newStatus) return setMessage("Please select a status");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/issues/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, updateText:updateText.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        await fetchIssueDetails();
        setUpdateText("");
        setMessage("Issue updated successfully");
      } else {
        setMessage(data.message || "Failed to update issue");
      }
    } catch (error) {
      console.error("Error updating issue:", error);
      setMessage("Error updating issue. Please try again.");
    }
  };

  if (loading) return <p className="p-10">Loading...</p>;
  if (!issue) return <p className="p-10 text-red-500">Issue not found</p>;

  return (
    <div className="flex min-h-screen">
      <div className="w-2/3 p-8 pr-0 bg-[#f8f7f3]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-orange-500">Issue Details (Clerk)</h1>
          <div className="flex items-center gap-4 text-black">
           <NotificationBell />
           <SettingsMenu />
          </div>
        </div>

        <div className="mb-4">
          <div className="text-2xl font-bold mb-2">{issue.title}</div>
          <div className="text-lg text-gray-700 mb-2">{issue.category}</div>
          <div className="text-gray-800 mb-4 whitespace-pre-wrap leading-relaxed">{issue.description}</div>

          <div className="font-bold mb-2">Location</div>
          <div className="mb-4 rounded-xl overflow-hidden border-2 border-gray-300">
            <MapDisplay lat={issue.latitude} lng={issue.longitude} interactive={false} />
          </div>
          <p className="text-lg text-gray-700 mb-4">{issue.location}</p>

          {issue.images?.length > 0 && (
            <button 
              className="w-full py-2 border border-gray-400 rounded-full font-semibold text-lg hover:bg-gray-100 transition flex items-center justify-center gap-2"
              onClick={() => window.open(issue.images[0], '_blank')}
            >
              <span>↓</span> Download Issue Files
            </button>
          )}
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

      <div className="w-1/3 bg-black text-white p-12">
        <h2 className="text-[#FF9100] text-2xl font-bold mb-8">Update Issue</h2>

        <div className="w-full mb-8">
          <label className="block text-lg mb-2">Select Status</label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full mb-4 bg-black border border-gray-600 rounded-md py-2 px-3 text-white"
          >
            <option value="Pending Approval">Pending Approval</option>
            <option value="Under Review">Under Review</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <label className="block text-lg mb-2">Update Text</label>
          <textarea
            className="w-full mb-4 bg-black border border-gray-600 rounded-md py-2 px-3 text-white min-h-[120px]"
            placeholder="Enter update details..."
            value={updateText}
            onChange={e => setUpdateText(e.target.value)}
          />

          <button
            className="w-full bg-[#FF9100] text-white py-3 rounded-full font-bold text-lg hover:bg-orange-600 transition mb-4"
            onClick={handleUpdateStatus}
          >
            Update
          </button>
          <button
            className="w-full border border-2 py-3 rounded-full border-2 border-[#FF9100] text-[#FF9100] text-xl font-bold hover:bg-[#ff91001a] transition"
            onClick={() => router.push('/clerk/dashboard')}
          >
            Clear
          </button>

          {message && (
            <p className={`mt-4 text-center font-semibold ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>
          )}
        </div>

        <div className="w-full border-b border-gray-700 mb-6"></div>
<div className="w-full">
  <div className="text-[#FF9100] text-xl font-bold mb-4">Updates</div>
  <ul className="mb-6 space-y-4">
    {issue.updates?.slice(0).reverse().map((update, i) => (
      <li key={i} className="text-white text-base flex flex-col gap-1">
        <span>
          • <span className="font-semibold">Update {String(issue.updates.length - i).padStart(2, "0")}:</span> {update.text}
        </span>
        {update.status && (
          <span className={`inline-block mt-1 px-3 py-1 rounded-md text-sm font-semibold ${STATUS_COLORS[update.status] || 'bg-gray-200 text-black'}`}>
            • {update.status}
          </span>
        )}
        {update.timestamp && (
          <span className="text-gray-400 text-xs italic mt-1">
            {new Date(update.timestamp).toLocaleString()}
          </span>
        )}
      </li>
    ))}
  </ul>
</div>

        
      </div>
    </div>
  );
}

export default withAuth(ClerkIssueDetailsPage, ["clerk"]);
