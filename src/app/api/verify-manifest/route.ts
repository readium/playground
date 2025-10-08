import { NextResponse } from "next/server";
import { verifyManifestUrlFromEnv } from "@edrlab/thorium-web/next";

// Configure this route to use the Edge Runtime
export const runtime = "edge";

// This function runs on the server
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const manifestUrl = searchParams.get("url");
  
  if (!manifestUrl) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  const result = verifyManifestUrlFromEnv(manifestUrl);
  
  if (!result.allowed) {
    return NextResponse.json(
      { error: result.error || "Domain not allowed" },
      { status: result.error === "Invalid URL" ? 400 : 403 }
    );
  }
  
  return NextResponse.json({ 
    allowed: true,
    url: result.url
  });
}
