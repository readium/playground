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
  setLineLength
} from "@edrlab/thorium-web/epub";

// TMP Component that is not meant to be implemented AS-IS, for testing purposes
export const PlaygroundMinChars = () => {
  const RSPrefs = usePreferences();
  const columnCount = useAppSelector(state => state.settings.columnCount);
  const layoutStrategy = useAppSelector(state => state.settings.layoutStrategy);
  const minLineLength = useAppSelector(state => state.settings.lineLength?.min);
  const dispatch = useAppDispatch();
  
  const { submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (isSelected: boolean) => {
    await submitPreferences({ 
      minimalLineLength: isSelected ? null : minLineLength?.chars || RSPrefs.typography.minimalLineLength
    });
  
    dispatch(setLineLength({
      key: "min",
      isDisabled: isSelected
    }));
  }, [submitPreferences, dispatch, minLineLength, RSPrefs.typography.minimalLineLength]);

  return(
    <>
    { RSPrefs.typography.minimalLineLength &&
      <div className={ layoutStrategyStyles.readerSettingsGroup }>
        <StatefulSwitch 
          label={ Locale.reader.layoutStrategy.minChars }
          onChange={ async (isSelected: boolean) => await updatePreference(isSelected) }
          isSelected={ minLineLength?.isDisabled }
          isDisabled={ layoutStrategy !== ThLayoutStrategy.columns && columnCount !== "2" }
        />
      </div>
    }
    </>
  )
}