"use client";

import { playgroundPreferences } from "@/preferences/preferences";
import { ThPreferencesProvider, ThStoreProvider } from "@edrlab/thorium-web/epub";

export const CustomProviders = ({ children }: { children: React.ReactNode } ) => {
  return(
    <ThStoreProvider storageKey="readium-playground-state">
      <ThPreferencesProvider value={ playgroundPreferences }>
        { children }
      </ThPreferencesProvider>
    </ThStoreProvider>
  )
}