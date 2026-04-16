/** @type {import("next").NextConfig} */
const nextConfig = {
  // Disable React running twice as it messes up with iframes
  reactStrictMode: false,
  typedRoutes: true,
  
  // Configure asset prefix for CDN or subdirectory support
  assetPrefix: process.env.ASSET_PREFIX || undefined,

  // Configure image domains for Next.js Image component
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.archive.org",
      },
    ],
  },
  
  // Turbopack configuration
  turbopack: {
    rules: {
      // Handle SVG imports with ?url as file URLs
      "*.svg?url": {
        loaders: ["file-loader"],
        as: "*.svg",
      },
      // Handle all other SVG imports as React components
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  async redirects() {
    const isProduction = process.env.NODE_ENV === "production";
    const isManifestEnabled = !isProduction || process.env.MANIFEST_ROUTE_FORCE_ENABLE === "true";

    if (isProduction && !isManifestEnabled) {
      return [
        {
          source: "/read/manifest/:path*",
          destination: "/",
          permanent: false,
        },
      ];
    }
    return [];
  }
};

export default nextConfig;
