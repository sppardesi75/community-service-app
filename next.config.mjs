/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en", "fr"],  // 👈 your supported languages
    defaultLocale: "en",    // 👈 default language
  }
};

export default nextConfig;
