/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    URL: "YOUR_DEFAULT_URL", // Replace with your default URL
    // Add other environment variables here directly
    // API_KEY: 'YOUR_API_KEY',
    // DATABASE_URL: 'YOUR_DATABASE_URL',
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "https://unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/random/**",
      },
    ],
    domains: [
      // other allowed domains...
      "certificatesinn.com",
    ],
  },
};
// next.config.js

export default nextConfig;