"use client";

import { playgroundPreferences } from "@/preferences/preferences";
import { makeStore, ThI18nProvider, StatefulPreferencesProvider, ThStoreProvider } from "@edrlab/thorium-web/epub";
import customReducer from "@/lib/customReducer";

export const CustomProviders = ({ children }: { children: React.ReactNode } ) => {
  return(
    <ThStoreProvider store={ makeStore("readium-playground-test", {
      custom: {
        reducer: customReducer,
        persist: true
      }
    }) }>
      <StatefulPreferencesProvider initialPreferences={ playgroundPreferences }>
        <ThI18nProvider ns={ ["thorium-web", "playground"] }>
          { children }
        </ThI18nProvider>
      </StatefulPreferencesProvider>
    </ThStoreProvider>
  )
}