import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',   // Required for Tauri (Windows) and Capacitor (Android)
  images: { unoptimized: true },
};

export default nextConfig;
