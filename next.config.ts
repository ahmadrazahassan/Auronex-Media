import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // Allow explicitly requested image quality values across Next/Image usages.
    // Without this, Next shows a warning and may ignore `quality={100}`.
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
    ],
  },
};

export default nextConfig;
