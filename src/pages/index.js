import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import LanguageToggle from "@/components/LanguageToggle";


export default function HomePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    "/pothole.jpg",
    "/garbage.jpg",
    "/streetlight.jpg",
    "/dumping.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-black text-[#fdfaf5] font-sans transition-all duration-500">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center px-6 sm:px-10 py-6 bg-black text-white">
        <h1 className="text-2xl sm:text-3xl font-bold text-orange-500 tracking-wide">
          {t("app_name")}
        </h1>
        <div className="mt-4 sm:mt-0 space-x-4 flex items-center">
          <LanguageToggle />
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 border border-white rounded-full hover:bg-white hover:text-black transition"
          >
            {t("login")}
          </button>
          <button
            onClick={() => router.push("/register")}
            className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
          >
            {t("register")}
          </button>
        </div>
      </header>

      {/* Intro Section */}
      <section className="text-center px-6 sm:px-10 mt-12 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-orange-500 mb-2 leading-snug tracking-snug cursor-pointer transition-all duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-orange-400 hover:via-yellow-300 hover:to-orange-500">
          {t("app_name")}
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#fdfaf5]">
          {t("tagline")}
        </h2>
        <p className="text-md sm:text-lg text-gray-300 leading-relaxed">
          {t("description")}
        </p>
      </section>

      {/* Image Slideshow with Blur */}
      <div className="mt-16 relative flex justify-center items-center bg-black">
        <div className="absolute inset-0 overflow-hidden opacity-30 blur-sm scale-105 z-0">
          <Image
            src={slides[slideIndex]}
            alt="Blurred Background"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="relative z-10 w-[90%] max-w-4xl rounded-xl overflow-hidden shadow-2xl border border-[#222]">
          <Image
            src={slides[slideIndex]}
            alt="Community Issue"
            width={1200}
            height={500}
            className="object-cover w-full h-[400px]"
          />
        </div>
      </div>

      {/* About Us Section */}
      <section className="mt-20 px-10 py-12 bg-[#111] text-[#fdfaf5] text-center">
        <h3 className="text-3xl font-bold text-orange-500 mb-6 tracking-wide">{t("about_us")}</h3>
        <div className="max-w-4xl mx-auto text-gray-300 leading-relaxed space-y-4 text-md sm:text-lg">
          <p>{t("about_text_1")}</p>
          <p>{t("about_text_2")}</p>
          <p>{t("about_text_3")}</p>
        </div>
      </section>

      {/* How it Works */}
      <section className="mt-20 px-6 sm:px-10 text-center">
        <h3 className="text-3xl font-bold mb-6 text-orange-500 transition duration-300 underline underline-offset-8">
          {t("how_it_works")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-6 max-w-6xl mx-auto">
          <div className="transition-transform duration-300 hover:scale-105 bg-[#1a1a1a] p-6 rounded-xl shadow-md">
            <h4 className="text-lg font-bold mb-2 text-white">
              1. <Link href="/register" className="text-orange-400 underline hover:text-orange-300">{t("register")}</Link> {" or "}
              <Link href="/login" className="text-orange-400 underline hover:text-orange-300">{t("login")}</Link>
            </h4>
            <p className="text-gray-300">{t("step_1_desc")}</p>
          </div>
          <div className="transition-transform duration-300 hover:scale-105 bg-[#1a1a1a] p-6 rounded-xl shadow-md">
            <h4 className="text-lg font-bold mb-2 text-white">2. {t("step_2")}</h4>
            <p className="text-gray-300">{t("step_2_desc")}</p>
          </div>
          <div className="transition-transform duration-300 hover:scale-105 bg-[#1a1a1a] p-6 rounded-xl shadow-md">
            <h4 className="text-lg font-bold mb-2 text-white">3. {t("step_3")}</h4>
            <p className="text-gray-300">{t("step_3_desc")}</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mt-20 px-6 sm:px-10 py-12 bg-[#111] text-white">
        <h3 className="text-3xl font-bold text-center text-orange-500 mb-10 tracking-wide">
          {t("team_title")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 justify-items-center">
          {["Sanskar Pardesi", "Vrunda Patel", "Yash Patel", "Nadi Lin", "Abhi Chakrani"].map((name, idx) => (
            <div
              key={idx}
              className="bg-[#1c1c1c] rounded-xl p-6 w-full max-w-xs text-center shadow-md hover:shadow-orange-400 transition"
            >
              <div className="mx-auto mb-4 w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-3.33 0-6 2.69-6 6v.5h12V20c0-3.31-2.67-6-6-6z" />
                </svg>
              </div>
              <p className="font-semibold text-lg">{name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm py-6 text-gray-400 bg-black">
        {t("footer")}
      </footer>
    </div>
  );
}
