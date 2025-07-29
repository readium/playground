"use client";

import { playgroundPreferences } from "@/preferences/preferences";
import { makeStore, ThPreferencesProvider, ThStoreProvider } from "@edrlab/thorium-web/epub";
import customReducer from "@/lib/customReducer";

export const CustomProviders = ({ children }: { children: React.ReactNode } ) => {
  return(
    <ThStoreProvider store={ makeStore("readium-playground", {
      custom: {
        reducer: customReducer,
        persist: true
      }
    }) }>
      <ThPreferencesProvider value={ playgroundPreferences }>
        { children }
      </ThPreferencesProvider>
    </ThStoreProvider>
  )
}