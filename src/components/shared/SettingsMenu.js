import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";

export default function SettingsMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="text-2xl">⚙️</button>
      {open && (
        <div className="absolute right-0 mt-2 bg-white text-black border rounded-md shadow-md z-50">
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}
