import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProduction = process.env.NODE_ENV === "production";
const isManifestEnabled = !isProduction || process.env.NEXT_PUBLIC_MANIFEST_FORCE_ENABLE === "true";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect manifest routes in production if not enabled
  if (isProduction && !isManifestEnabled && pathname.startsWith("/read/manifest/")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/read/manifest/:path*"],
};
