"use client";

import { useCallback, Key, useMemo } from "react";

import settingsStyles from "../assets/styles/playgroundSettings.module.css";


import { 
  useAppDispatch,  
  useI18n,
  setL10n,
  StatefulDropdown
} from "@edrlab/thorium-web/epub";

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" }
];

const DEFAULT_LANGUAGE = "en";

export const PlaygroundLanguageSetting = () => {
  const { t, currentLanguage, changeLanguage } = useI18n("playground");
  const dispatch = useAppDispatch();

  // Match language code, handling cases like "en-US" matching "en"
  const selectedLanguage = useMemo(() => {
    // If no language is set, return default
    if (!currentLanguage) return DEFAULT_LANGUAGE;
    
    // Normalize both current language and supported languages to lowercase for comparison
    const currentLangLower = currentLanguage.toLowerCase();
    const supportedLanguages = SUPPORTED_LANGUAGES.map(lang => ({
      ...lang,
      codeLower: lang.code.toLowerCase()
    }));

    // Try exact match first
    const exactMatch = supportedLanguages.find(
      lang => currentLangLower === lang.codeLower
    );
    if (exactMatch) return exactMatch.code;

    // Try language code match (e.g., "en-US" matches "en")
    const langCodeMatch = supportedLanguages.find(
      lang => currentLangLower.startsWith(`${lang.codeLower}-`)
    );
    if (langCodeMatch) return langCodeMatch.code;

    // Default to the explicitly defined default language
    return DEFAULT_LANGUAGE;
  }, [currentLanguage]);

  const handleLanguageChange = useCallback(async (key: Key | null) => {
    if (key) {
      const selectedLanguage = key.toString();
      try {
        await changeLanguage(selectedLanguage);
        dispatch(setL10n({ locale: selectedLanguage }));
      } catch (error) {
        console.error("Failed to change language:", error);
      }
    }
  }, [changeLanguage, dispatch]);

  return (
    <StatefulDropdown 
      standalone={ true }
      className={ settingsStyles.readerSettingsGroup }
      label={ t("reader.readerSettings.language.title") }
      selectedKey={ selectedLanguage }
      onSelectionChange={ handleLanguageChange }
      items={ SUPPORTED_LANGUAGES.map(lang => ({
        id: lang.code,
        label: lang.name,
        value: lang.code
      })) }
    />
  );
};