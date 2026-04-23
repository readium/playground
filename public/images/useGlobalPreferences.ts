"use client";

import { useContext } from "react";
import { ThGlobalPreferencesContext } from "../ThGlobalPreferencesContext";

export const useGlobalPreferences = () => {
  const context = useContext(ThGlobalPreferencesContext);
  if (!context) throw new Error("useGlobalPreferences must be used within a ThGlobalPreferencesProvider");
  return context;
};
