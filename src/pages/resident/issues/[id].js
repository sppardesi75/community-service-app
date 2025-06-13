// pages/resident/issues/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function IssueDetailsPage() {
  const { query } = useRouter();
  const { id } = query;

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(0);
  const [message, setMessage] = useState("");
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchIssue = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/issues/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setIssue(data.issue);
        setLoading(false);
      } catch (err) {
        setMessage("Failed to load issue");
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  const handleRating = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/issues/${id}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating: feedback, comment: feedbackText }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

const handleWithdraw = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`/api/issues/${id}/withdraw`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  setMessage(data.message);

  // Redirect to dashboard after 2 seconds
  setTimeout(() => {
    window.location.href = "/resident/dashboard";
  }, 2000);
};


  if (loading) return <p className="p-10">Loading...</p>;
  if (!issue) return <p className="p-10 text-red-500">Issue not found</p>;

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Issue Details */}
      <div className="w-2/3 p-8 bg-[#fdfaf5]">
        {/* Header with notification icons */}
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-4xl font-bold text-orange-500">Issue Details (User)</h1>
          <div className="flex items-center gap-4 text-black">
            <span className="text-2xl">🔔</span>
            <span className="text-2xl">⚙️</span>
          </div>
        </div>

        {/* Issue Title */}
        <h2 className="text-2xl font-bold text-black mb-4">{issue.title}</h2>
        
        {/* Filed Date */}
        <p className="text-lg text-gray-600 mb-6">
          Filed On: {new Date(issue.createdAt).toLocaleDateString()}
        </p>
        
        {/* Category Dropdown */}
        <div className="mb-8">
          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg border">
            <span className="text-lg text-gray-700">{issue.category}</span>
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          {issue.description}
        </p>
        
        {/* Location Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-black mb-4">Location</h3>
          <div className="rounded-2xl overflow-hidden border-2 border-gray-200">
            <div className="h-64 bg-blue-900 relative">
              <img 
                src="/map-placeholder.png" 
                alt="Map" 
                className="w-full h-full object-cover"
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)'
                }}
              />
              <div className="absolute inset-0 bg-blue-800 opacity-80"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-sm font-medium mb-2">TRINITY-BELLWOODS</div>
                  <div className="text-sm font-medium mb-2">PARKDALE</div>
                  <div className="text-lg font-bold">HARBOURFRONT</div>
                </div>
              </div>
            </div>
            <div className="bg-blue-700 text-white text-center py-4">
              <span className="text-2xl font-bold">Toronto</span>
            </div>
          </div>
        </div>
        
        {/* Download Button */}
        {issue.images?.length > 0 && (
          <a
            href={issue.images[0]}
            className="block text-center border-2 border-black py-4 w-full rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
            download
          >
            ↓ Download Issue Files
          </a>
        )}
      </div>

      {/* Right Side - Updates and Feedback */}
      <div className="w-1/3 bg-black text-white p-8">
        {/* Updates Section */}
        <h2 className="text-4xl font-bold text-orange-400 mb-8">Updates</h2>
        
        <div className="space-y-6 mb-12">
          {issue.updates?.slice(0).reverse().map((update, i) => (
            <div key={i} className="text-lg">
              <p className="mb-3">• Update {String(issue.updates.length - i).padStart(2, '0')}: {update.text}</p>
              <div className={`inline-block px-4 py-2 rounded-full text-black font-bold text-sm ${
                update.status === "Pending Approval"
                  ? "bg-blue-300"
                  : update.status === "Under Review"
                  ? "bg-yellow-300"
                  : update.status === "Resolved"
                  ? "bg-green-300"
                  : update.status === "Rejected"
                  ? "bg-red-300"
                  : "bg-white"
              }`}>
                • {update.status}
              </div>
            </div>
          ))}
        </div>

        {/* Feedback Section */}
        <div className="\ border-gray-600 pt-8">
          {/* Feedback Textarea */}
          <textarea
            placeholder="Feedback"
            className="w-full bg-transparent border-b border-white-400 focus:outline-none focus:border-white py-2 placeholder-gray-300"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
          
          {/* Star Rating and Submit Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFeedback(star)}
                  className="text-4xl focus:outline-none transition-all duration-200"
                >
                  <span
                    className={`${
                      feedback >= star
                        ? "text-yellow-400"
                        : "text-transparent"
                    }`}
                    style={{
                      WebkitTextStroke: feedback >= star ? "0" : "2px white",
                      textStroke: feedback >= star ? "0" : "2px white"
                    }}
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={handleRating}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full text-lg transition-colors"
            >
              Submit
            </button>
          </div>

          {/* Withdraw Button */}
          <button
            onClick={handleWithdraw}
            className="w-full border-2 border-red-400 text-red-400 font-bold py-4 rounded-full hover:bg-red-400 hover:text-white text-lg transition-all duration-200 mb-6"
          >
            Withdraw
          </button>

          {/* Message Display */}
          {message && (
            <p className="text-green-400 text-lg font-medium">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}