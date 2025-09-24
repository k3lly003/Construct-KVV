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
        hostname: "unsplash.com",
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
      // TODO: Remove this when example.com URLs are replaced with proper image URLs
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
      },
    ],
    domains: [
      // other allowed domains...
      "certificatesinn.com",
      // TODO: Remove example.com when placeholder URLs are replaced
      "example.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /pdf\.worker(\.min)?\.js$/,
      use: { loader: "worker-loader" },
    });

    return config;
  },
};
// next.config.js

export default nextConfig;