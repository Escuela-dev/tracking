import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// during local development access in any of your server code, local versions of Cloudflare bindings as indicated in the bindings documentation.
// https://opennext.js.org/cloudflare/bindings
initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

export default nextConfig;
