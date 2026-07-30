import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // proxy.ts 會攔截 /api/admin/:path*,Next.js 預設只會緩衝前 10MB 的 request body,
    // 超過的話 formData() 會解析失敗(電子書上傳上限是 30MB,所以要調高這個限制)。
    proxyClientMaxBodySize: "32mb",
  },
};

export default nextConfig;
