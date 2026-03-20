"use client";

import { use, useEffect, useState } from "react";

import "@edrlab/thorium-web/misc/styles";
import "@edrlab/thorium-web/epub/styles";

import { PUBLICATION_MANIFESTS } from "@/config/publications";

import { StatefulLoader, ErrorDisplay, ErrorHandler, ProcessedError } from "@edrlab/thorium-web/misc";
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
  const isLoading = useAppSelector(state => state.reader.isLoading);
  const manifestUrl = identifier ? PUBLICATION_MANIFESTS[identifier as keyof typeof PUBLICATION_MANIFESTS] : "";

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
      console.error("Publication loading error:", error);
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
