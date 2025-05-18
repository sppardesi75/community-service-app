import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // ✅ Store token & user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Redirect based on role
      const role = data.user.role;
      if (role === "admin") {
        router.push("/admin-dashboard");
      } else if (role === "clerk") {
        router.push("/clerk-dashboard");
      } else {
        router.push("/resident-dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Branding */}
      <div className="w-1/2 bg-black text-white flex items-center justify-center p-10">
        <div>
          <h1 className="text-3xl font-bold mb-4">Community Service App</h1>
          <p className="text-lg">Making Ontario Better,<br />One Report at a Time.</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-1/2 flex items-center justify-center p-10 bg-white">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Get started</h2>

          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700">E-Mail Address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border-b border-gray-400 focus:outline-none focus:border-black bg-transparent py-1"
              required
            />
          </label>

          <label className="block mb-6">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border-b border-gray-400 focus:outline-none focus:border-black bg-transparent py-1"
              required
            />
          </label>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <div className="flex gap-2 mb-4">
            <button
              type="button"
              className="bg-black text-white px-4 py-2 rounded-full font-medium hover:bg-gray-800"
              onClick={() => router.push("/register")}
            >
              Sign Up
            </button>
            <button
              type="submit"
              className="border border-black text-black px-4 py-2 rounded-full font-medium hover:bg-black hover:text-white transition"
            >
              Log In
            </button>
          </div>

          <p className="text-sm text-blue-700 text-center hover:underline cursor-pointer">
            Forgot Password?
          </p>
        </form>
      </div>
    </div>
  );
}
