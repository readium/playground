export const MANIFEST_CONFIG = {
  // Manifest route is enabled by default in development (pnpm dev)
  // Disabled by default in production (pnpm build && pnpm start)
  // Use forceEnable to enable in production
  enabled: process.env.NODE_ENV === "development",

  // List of allowed domains for manifest URLs in production
  // Only used when forceEnable is true
  allowedDomains: process.env.NEXT_PUBLIC_MANIFEST_ALLOWED_DOMAINS
    ? process.env.NEXT_PUBLIC_MANIFEST_ALLOWED_DOMAINS.split(",")
    : [],

  // Enable manifest route in production
  // Requires allowedDomains to be set
  forceEnable: process.env.NEXT_PUBLIC_MANIFEST_FORCE_ENABLE === "true"
} as const;
