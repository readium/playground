/** @type {import("next").NextConfig} */
const nextConfig = {
  // Disable React running twice as it messes up with iframes
  reactStrictMode: false,
  typedRoutes: true,
  experimental: {
    webpackBuildWorker: true,
  },
  // Configure asset prefix for CDN or subdirectory support
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || undefined,
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
  async redirects() {
    const isProduction = process.env.NODE_ENV === "production";
    const isManifestEnabled = !isProduction || process.env.NEXT_PUBLIC_MANIFEST_FORCE_ENABLE === "true";

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
  },
  async headers() {
    // Get allowed domains from environment variable or default to all in development
    const allowedDomains = process.env.NEXT_PUBLIC_MANIFEST_ALLOWED_DOMAINS
      ? process.env.NEXT_PUBLIC_MANIFEST_ALLOWED_DOMAINS.split(",")
          .map(domain => domain.trim())
          // Ensure domain has protocol
          .map(domain => {
            if (domain === "*") return domain;
            if (!domain.match(/^https?:\/\//)) {
              return `https://${ domain }`;
            }
            return domain;
          })
      : [];
    
    // In development, allow all origins for easier testing
    const allowAllOrigins = process.env.NODE_ENV !== "production";
    
    // If no domains are specified and not in development, default to empty array (deny all)
    const allowedOrigins = allowAllOrigins 
      ? ["*"]
      : allowedDomains.length > 0 
        ? allowedDomains 
        : [];

    return [
      {
        // Match all requests
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: allowedOrigins.join(",") || "null",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,HEAD,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
