import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (!password || password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Reset failed");
        return;
      }

      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError("Unexpected error");
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* Left Panel */}
      <div className="w-1/2 bg-black text-white flex flex-col justify-center items-start pl-20">
        <h1 className="text-5xl font-extrabold text-orange-500 leading-tight">
          Reset<br />Your<br />Password
        </h1>
        <p className="mt-6 text-lg text-gray-300">Set a new password to access your account.</p>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 bg-[#fdfaf5] flex items-center justify-center">
        <form onSubmit={handleReset} className="w-full max-w-sm px-4">
          <h2 className="text-2xl font-semibold text-black mb-10 text-center">Enter New Password</h2>

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mb-6 bg-transparent border-b border-gray-400 focus:outline-none focus:border-black py-2 placeholder:text-gray-600"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full mb-6 bg-transparent border-b border-gray-400 focus:outline-none focus:border-black py-2 placeholder:text-gray-600"
          />

          {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white w-full py-2 rounded-full font-semibold shadow-md transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
