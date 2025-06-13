import { useState, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/router";

export default function ResidentDashboard() {
  const router = useRouter();
  const [issues, setIssues] = useState([]);
  const [formData, setFormData] = useState({ title: "", category: "", description: "", location: "" });
  const [images, setImages] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  //  Fetch issues from backend
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/issues/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setIssues(data.issues || []);
      } catch (err) {
        console.error("Failed to fetch issues:", err);
      }
    };
    fetchIssues();
  }, [success]);

  const groupedIssues = issues.reduce((acc, issue) => {
    if (!acc[issue.status]) acc[issue.status] = [];
    acc[issue.status].push(issue);
    return acc;
  }, {});

  const renderCard = (status, color) => (
    <div key={status} className="mb-5">
      <p className="text-lg font-medium mb-3 px-3 py-1" style={{ backgroundColor: color, borderRadius: 8 }}>
        {status}
      </p>
      {(groupedIssues[status] || []).map((issue) => (
        <div
  key={issue._id}
  onClick={() => router.push(`/resident/issues/${issue._id}`)}
  className="cursor-pointer bg-white rounded-xl p-6 mb-2 shadow-md flex justify-between items-center hover:shadow-lg transition"
>

          <div>
            <h1 className="font-bold text-black">{issue.title}</h1>
            <p className="text-sm text-gray-600">
              Filed on: {new Date(issue.createdAt).toLocaleDateString()}
            </p>
          </div>
          <FiArrowRight size={20} />
        </div>
      ))}
    </div>
  );

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError("You can upload a maximum of 5 images.");
      return;
    }

    const newFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newFiles]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      const body = new FormData();
      Object.entries(formData).forEach(([key, value]) => body.append(key, value));
      images.forEach((imgObj) => body.append("images", imgObj.file));

      const res = await fetch("/api/report", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");

      setSuccess("Complaint submitted successfully!");
      handleClear();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClear = () => {
    setFormData({ title: "", category: "", description: "", location: "" });
    setImages([]);
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Panel – Dashboard */}
      <div className="w-1/2 bg-[#fdfaf5] p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-orange-500">User Dashboard</h2>
          <div className="flex items-center gap-4 text-black">
            <span className="text-2xl">🔔</span>
            <span className="text-2xl">⚙️</span>
          </div>
        </div>

        {renderCard("Pending Approval", "#d1ecf1")}
        {renderCard("Under Review", "#fdf8d7")}
        {renderCard("Resolved", "#d4edda")}
        {renderCard("Rejected", "#f8d7da")}
      </div>

      {/* Right Panel – Complaint Form */}
      <div className="w-1/2 bg-black text-white p-10 flex flex-col justify-center">
        <h2 className="text-xl sm:text-4xl font-semibold text-orange-500 mb-6 justify-center">
          Create a new complaint
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-gray-400 focus:outline-none focus:border-white py-2 placeholder-gray-300"
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-black border-b border-gray-400 focus:outline-none focus:border-white py-2 text-gray-300"
            required
          >
            <option value="" disabled hidden className="text-gray-400">
              Category
            </option>
            <option value="Garbage">Garbage</option>
            <option value="Pothole">Pothole</option>
            <option value="Streetlight">Streetlight</option>
            <option value="Illegal Dumping">Illegal Dumping</option>
          </select>

          <textarea
            name="description"
            placeholder="Description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-gray-400 focus:outline-none focus:border-white py-2 placeholder-gray-300 resize-none"
            required
          />

          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-gray-400 focus:outline-none focus:border-white py-2 placeholder-gray-300"
            required
          />

          <div className="bg-slate-800 text-center text-white py-16 rounded-xl">
            <p className="text-lg font-medium">Toronto</p>
          </div>

          <input type="file" multiple accept="image/*" onChange={handleImageChange} hidden id="fileInput" />
          <label htmlFor="fileInput" className="w-full border border-white py-2 rounded-full text-white font-semibold text-center cursor-pointer block">
            + Attach Files
          </label>

          {images.length > 0 && (
            <>
              <p className="text-xs text-green-400 text-center mb-2">{images.length} image(s) selected</p>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {images.map((imgObj, idx) => (
                  <div key={idx} className="relative">
                    <img src={imgObj.preview} className="h-20 w-full object-cover rounded" alt={`Preview ${idx + 1}`} />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-bl"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {success && <p className="text-green-400 text-sm text-center">{success}</p>}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 py-2 border border-red-400 rounded-full text-red-400 hover:bg-red-500 hover:text-white transition"
            >
              Clear
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
