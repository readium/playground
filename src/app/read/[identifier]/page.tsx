"use client";

import { use, useEffect, useState } from "react";

import { PUBLICATION_MANIFESTS } from "@/config/publications";

import { ErrorDisplay, ErrorHandler, ProcessedError } from "@edrlab/thorium-web/misc";
import { usePublication } from "@edrlab/thorium-web/reader";
import { useAppSelector } from "@edrlab/thorium-web/epub";
import { CustomReader } from "@/Components/CustomReader";

import { verifyManifestUrl } from "@/app/api/verify-manifest/verifyDomain";
type Params = { identifier: string };

type Props = {
  params: Promise<Params>;
};

export default function BookPage({ params }: Props) {
  const [domainError, setDomainError] = useState<ProcessedError | null>(null);
  const identifier = use(params).identifier;
  const readerLoading = useAppSelector(state => state.reader.isLoading);
  const manifestUrl = identifier ? PUBLICATION_MANIFESTS[identifier as keyof typeof PUBLICATION_MANIFESTS] : "";

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
    isLoading,
    error,
    publication,
    profile,
    localDataKey
  } = usePublication({
    url: manifestUrl,
    onError: (error) => {
      console.error("Publication loading error:", error);
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
            isLoading={ isLoading || readerLoading }
          />
        )
      )}
    </>
  );
}
