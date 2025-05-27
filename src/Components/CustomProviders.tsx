"use client";

import dynamic from "next/dynamic";

const ThPreferencesProvider = dynamic(() => 
  import("@edrlab/thorium-web/epub").then((mod) => mod.ThPreferencesProvider),
  { ssr: false }
);

const ThStoreProvider = dynamic(() => 
  import("@edrlab/thorium-web/epub").then((mod) => mod.ThStoreProvider),
  { ssr: false }
);

import { playgroundPreferences } from "@/preferences/preferences";

export const CustomProviders = ({ children }: { children: React.ReactNode } ) => {
  return(
    <ThStoreProvider storageKey="readium-playground-state">
      <ThPreferencesProvider value={ playgroundPreferences }>
        { children }
      </ThPreferencesProvider>
    </ThStoreProvider>
  )
}