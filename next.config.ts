import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // 카메라(사진 식별·Zone)·마이크(음성 검색)·위치(지도·풍향)는 이 앱에서만 허용
  { key: "Permissions-Policy", value: "camera=(self), microphone=(self), geolocation=(self)" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
