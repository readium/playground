"use client";

import { makeStore, ThStoreProvider } from "@edrlab/thorium-web/reader";
import customReducer from "@/lib/customReducer";

export const store = makeStore("readium-playground", {
  custom: {
    reducer: customReducer,
    persist: true
  }
});

export const CustomProviders = ({ children }: { children: React.ReactNode } ) => {
  return(
    <ThStoreProvider store={ store }>
      { children }
    </ThStoreProvider>
  )
}