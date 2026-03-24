import type { NextConfig } from "next";

const PY_API = "http://127.0.0.1:8000";
const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/docs",
        destination: "/api/docs",
        permanent: false,
      },
      {
        source: "/openapi.json",
        destination: "/api/openapi.json",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: isDev ? `${PY_API}/api/:path*` : "/api/",
      },
    ];
  },
};

export default nextConfig;
