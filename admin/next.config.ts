import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/pathfind", destination: "http://localhost:3002", permanent: false },
      { source: "/guide", destination: "http://localhost:3002/guide", permanent: false },
      { source: "/docs", destination: "http://localhost:3003", permanent: false },
    ];
  },
};

export default nextConfig;
