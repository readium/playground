export async function verifyManifestUrl(url: string): Promise<boolean> {
  if (!url) return false;
  
  try {
    // Decode the URL first in case it's encoded
    const decodedUrl = decodeURIComponent(url);
    const response = await fetch(`/api/verify-manifest?url=${ encodeURIComponent(decodedUrl) }`);
    return response.ok;
  } catch {
    return false;
  }
}
