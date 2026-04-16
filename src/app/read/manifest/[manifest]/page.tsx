"use client";

import { use, useEffect, useState } from "react";

import { ErrorDisplay, ErrorHandler, ProcessedError } from "@edrlab/thorium-web/misc";
import { usePublication } from "@edrlab/thorium-web/reader";
import { useAppSelector } from "@edrlab/thorium-web/epub";
import { CustomReader } from "@/Components/CustomReader";

import { verifyManifestUrl } from "@/app/api/verify-manifest/verifyDomain";

type Params = { manifest: string };

type Props = {
  params: Promise<Params>;
};

export default function ManifestPage({ params }: Props) {
  const [domainError, setDomainError] = useState<ProcessedError | null>(null);
  const readerLoading = useAppSelector(state => state.reader.isLoading);
  const manifestUrl = use(params).manifest;

  useEffect(() => {
    if (manifestUrl) {
      verifyManifestUrl(manifestUrl).then(allowed => {
        if (!allowed) {
          const processedDomainError = ErrorHandler.process(
            new Error("Domain not allowed"), 
            "Domain Validation"
          );
          setDomainError(processedDomainError);
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
      />
    );
  }

  return (
    <>
      { error ? (
        <ErrorDisplay error={ error } />
      ) : (
        publication && (
          <CustomReader
            profile={ profile ?? undefined }
            publication={ publication }
            localDataKey={ localDataKey }
            isLoading={ publicationLoading || readerLoading }
          />
        )
      )}
    </>
  );
}
