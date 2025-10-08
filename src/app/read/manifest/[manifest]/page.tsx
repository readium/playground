"use client";

import { use, useEffect, useState } from "react";

import { StatefulLoader, usePublication, useAppSelector } from "@edrlab/thorium-web/epub";
import { CustomReader } from "@/Components/CustomReader";

import "../../../base.css";
import { verifyManifestUrl } from "@/app/api/verify-manifest/verifyDomain";

type Params = { manifest: string };

type Props = {
  params: Promise<Params>;
};

export default function ManifestPage({ params }: Props) {
  const [domainError, setDomainError] = useState<string | null>(null);
  const isLoading = useAppSelector(state => state.reader.isLoading);
  const manifestUrl = use(params).manifest;

  useEffect(() => {
    if (manifestUrl) {
      verifyManifestUrl(manifestUrl).then(allowed => {
        if (!allowed) {
          setDomainError(`Domain not allowed: ${ new URL(manifestUrl).hostname }`);
        }
      });
    }
  }, [manifestUrl]);

  const { error, manifest, selfLink } = usePublication({
    url: manifestUrl,
    onError: (error) => {
      console.error("Manifest loading error:", error);
    }
  });

  if (domainError) {
    return (
      <div className="container">
        <h1>Access Denied</h1>
        <p>{ domainError }</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>Error</h1>
        <p>{ error }</p>
      </div>
    );
  }

  return (
    <StatefulLoader isLoading={ isLoading }>
      { manifest && selfLink && <CustomReader rawManifest={ manifest } selfHref={ selfLink } /> }
    </StatefulLoader>
  );
}
