"use server";

export const isManifestRouteEnabled = async (): Promise<boolean> => {
  return process.env.NODE_ENV === "development" || 
         process.env.MANIFEST_ROUTE_FORCE_ENABLE === "true";
};