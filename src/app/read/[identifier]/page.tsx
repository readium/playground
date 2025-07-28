"use client";

import { use } from "react";

import { PUBLICATION_MANIFESTS } from "@/config/publications";

import { StatefulLoader, usePublication, useAppSelector } from "@edrlab/thorium-web/epub";
import { CustomReader } from "@/Components/CustomReader";

import "../../base.css";

type Params = { identifier: string };

type Props = {
  params: Promise<Params>;
};

export default function BookPage({ params }: Props) {
  const identifier = use(params).identifier;
  const isLoading = useAppSelector(state => state.reader.isLoading);

  const { error, manifest, selfLink } = usePublication({
    url: identifier ? PUBLICATION_MANIFESTS[identifier as keyof typeof PUBLICATION_MANIFESTS] : "",
    onError: (error) => {
      console.error("Publication loading error:", error);
    }
  });

  return (
    <>
      { error ? (
        <div className="container">
          <h1>Error</h1>
          <p>{ error }</p>
        </div>
      ) : (
        <StatefulLoader isLoading={ isLoading }>
          { manifest && selfLink && <CustomReader rawManifest={ manifest } selfHref={ selfLink } /> }
        </StatefulLoader>
      )}
    </>
  );
}
