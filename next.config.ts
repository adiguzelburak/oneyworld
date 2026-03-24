import type { NextConfig } from "next";

const PY_API = "http://127.0.0.1:8000";
const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: isDev ? `${PY_API}/api/:path*` : "/api/",
      },
      {
        source: "/docs",
        destination: isDev ? `${PY_API}/api/docs` : "/api/docs",
      },
      {
        source: "/openapi.json",
        destination: isDev ? `${PY_API}/api/openapi.json` : "/api/openapi.json",
      },
    ];
  },
};

export default nextConfig;
