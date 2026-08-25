import type { NextConfig } from "next";

// Note: Security headers for static export are handled via _headers file
// and meta tags. Next.js headers config doesn't work with output: export.

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
