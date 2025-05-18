import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      router.push("/login");
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="w-1/2 bg-black text-white flex items-center justify-center p-10">
        <div>
          <h1 className="text-3xl font-bold mb-4">Community Service App</h1>
          <p className="text-lg">Making Ontario Better,<br />One Report at a Time.</p>
        </div>
      </div>

      {/* Right signup form */}
      <div className="w-1/2 flex items-center justify-center p-10 bg-white">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold mb-6 text-center">Create your account</h2>

          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700">Full Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full border-b border-gray-400 focus:outline-none focus:border-black bg-transparent py-1"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700">E-Mail Address</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full border-b border-gray-400 focus:outline-none focus:border-black bg-transparent py-1"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 block w-full border-b border-gray-400 focus:outline-none focus:border-black bg-transparent py-1"
              required
            />
          </label>

          <label className="block mb-6">
            <span className="text-sm font-medium text-gray-700">Confirm Password</span>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              className="mt-1 block w-full border-b border-gray-400 focus:outline-none focus:border-black bg-transparent py-1"
              required
            />
          </label>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-full font-medium hover:bg-gray-800 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
