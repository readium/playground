"use client";

import { useCallback } from "react";

import Locale from "../../../resources/locales/en.json";

import layoutStrategyStyles from "./assets/styles/layoutStrategy.module.css";

import { ThLayoutStrategy } from "@edrlab/thorium-web/core/preferences";

import { 
  StatefulSwitch,
  useEpubNavigator,
  usePreferences,
  useAppDispatch,
  useAppSelector,
  setTmpMaxChars
} from "@edrlab/thorium-web/epub";

// TMP Component that is not meant to be implemented AS-IS, for testing purposes
export const PlaygroundMaxChars = () => {
  const RSPrefs = usePreferences();
  const layoutStrategy = useAppSelector(state => state.settings.layoutStrategy);
  const lineLength = useAppSelector(state => state.settings.tmpLineLengths[2]);
  const maxChars = useAppSelector(state => state.settings.tmpMaxChars);
  const dispatch = useAppDispatch();
  
  const { submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: number | null | undefined) => {
    await submitPreferences({ 
      maximalLineLength: value
    });
  
    dispatch(setTmpMaxChars(value === null));
  }, [submitPreferences, dispatch]);

  return(
    <>
    { RSPrefs.typography.maximalLineLength &&
      <div className={ layoutStrategyStyles.readerSettingsGroup }>
        <StatefulSwitch 
          label={ Locale.reader.layoutStrategy.maxChars }
          onChange={ async (isSelected: boolean) => await updatePreference(isSelected ? null : lineLength || RSPrefs.typography.maximalLineLength) }
          isSelected={ maxChars }
          isDisabled={ layoutStrategy !== ThLayoutStrategy.lineLength }
        />
      </div>
    }
    </>
  )
}