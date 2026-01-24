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
  /* config options here */
};

// PWA DISABLED temporarily for debugging build/dev errors
// export default withPWA(nextConfig);
export default nextConfig;
