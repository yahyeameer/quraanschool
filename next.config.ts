import type { NextConfig } from "next";

/*
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});
*/

const nextConfig: NextConfig = {
  turbopack: {}, // Silence Turbopack warning
  typescript: {
    // Dangerously allow production builds even if there are type errors (for gradual fixes)
    // REMOVE THIS once all type errors are resolved
    ignoreBuildErrors: false,
  },
};

// PWA DISABLED temporarily for debugging build/dev errors
// export default withPWA(nextConfig);
export default nextConfig;
