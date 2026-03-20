"use client";

import { use, useEffect, useState } from "react";

import { StatefulLoader, ErrorDisplay, ErrorHandler, ProcessedError } from "@edrlab/thorium-web/misc";
import { usePublication } from "@edrlab/thorium-web/reader";
import { useAppSelector } from "@edrlab/thorium-web/epub";
import { CustomReader } from "@/Components/CustomReader";

import "@edrlab/thorium-web/misc/styles";
import "@edrlab/thorium-web/epub/styles";

import { verifyManifestUrl } from "@/app/api/verify-manifest/verifyDomain";

type Params = { manifest: string };

type Props = {
  params: Promise<Params>;
};

export default function ManifestPage({ params }: Props) {
  const [domainError, setDomainError] = useState<ProcessedError | null>(null);
  const isLoading = useAppSelector(state => state.reader.isLoading);
  const manifestUrl = use(params).manifest;

  useEffect(() => {
    if (manifestUrl) {
      verifyManifestUrl(manifestUrl).then(allowed => {
        if (!allowed) {
          setDomainError(ErrorHandler.process(new Error("Domain not allowed"), "Domain Validation"));
        }
      });
    }
  }, [manifestUrl]);

  const {
    isLoading: publicationLoading,
    error,
    publication,
    profile,
    localDataKey
  } = usePublication({
    url: manifestUrl,
    onError: (error) => {
      console.error("Manifest loading error:", error);
    }
  });

  if (domainError) {
    return (
      <ErrorDisplay
        error={ domainError }
        title="reader.app.errors.accessDeniedTitle"
      />
    );
  }

  return (
    <>
      { error ? (
        <ErrorDisplay error={ error } />
      ) : (
        <StatefulLoader isLoading={ isLoading || publicationLoading }>
          { publication && (
            <CustomReader
              profile={ profile }
              publication={ publication }
              localDataKey={ localDataKey }
            />
          )}
        </StatefulLoader>
      )}
    </>
  );
}
