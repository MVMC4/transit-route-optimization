import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard/:path*",
        destination: "http://localhost:3001/dashboard/:path*",
        permanent: false,
      },
      {
        source: "/routes/:path*",
        destination: "http://localhost:3001/routes/:path*",
        permanent: false,
      },
      {
        source: "/docs/:path*",
        destination: "http://localhost:8000/api/docs",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
