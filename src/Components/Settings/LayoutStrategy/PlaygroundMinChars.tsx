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
  setTmpMinChars
} from "@edrlab/thorium-web/epub";

// TMP Component that is not meant to be implemented AS-IS, for testing purposes
export const PlaygroundMinChars = () => {
  const RSPrefs = usePreferences();
  const columnCount = useAppSelector(state => state.settings.columnCount);
  const layoutStrategy = useAppSelector(state => state.settings.layoutStrategy);
  const lineLength = useAppSelector(state => state.settings.tmpLineLengths[0]);
  const minChars = useAppSelector(state => state.settings.tmpMinChars);
  const dispatch = useAppDispatch();
  
  const { submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: number | null | undefined) => {
    await submitPreferences({ 
      minimalLineLength: value
    });
  
    dispatch(setTmpMinChars(value === null));
  }, [submitPreferences, dispatch]);

  return(
    <>
    { RSPrefs.typography.minimalLineLength &&
      <div className={ layoutStrategyStyles.readerSettingsGroup }>
        <StatefulSwitch 
          label={ Locale.reader.layoutStrategy.minChars }
          onChange={ async (isSelected: boolean) => await updatePreference(isSelected ? null : lineLength || RSPrefs.typography.minimalLineLength) }
          isSelected={ minChars }
          isDisabled={ layoutStrategy !== ThLayoutStrategy.columns && columnCount !== "2" }
        />
      </div>
    }
    </>
  )
}