// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   poweredByHeader: false,
//   images: {
//     formats: ["image/avif", "image/webp"],
//     deviceSizes: [480, 768, 1080, 1440, 1920],
//     minimumCacheTTL: 86400,
//   },
//   async headers() {
//     return [
//       {
//         source: "/:path*",
//         headers: [
//           { key: "X-Content-Type-Options", value: "nosniff" },
//           { key: "X-Frame-Options", value: "SAMEORIGIN" },
//           { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
//           { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;




// new code 





import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 768, 1080, 1440, 1920],
    minimumCacheTTL: 86400,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
  key: "Content-Security-Policy",
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https: https://*.microlink.io https://cdn.microlink.io https://microlink-cdn.s3.amazonaws.com",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
},
        ],
      },
    ];
  },
};

export default nextConfig;