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
export const PlaygroundMaxChars = () => {
  const RSPrefs = usePreferences();
  const layoutStrategy = useAppSelector(state => state.settings.layoutStrategy);
  const maxLineLength = useAppSelector(state => state.settings.lineLength?.max);

  const dispatch = useAppDispatch();
  
  const { submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (isSelected: boolean) => {
    await submitPreferences({ 
      maximalLineLength: isSelected ? null : maxLineLength?.chars || RSPrefs.typography.maximalLineLength
    });
  
    dispatch(setLineLength({
      key: "max",
      isDisabled: isSelected
    }));
  }, [submitPreferences, dispatch, maxLineLength, RSPrefs.typography.maximalLineLength]);

  return(
    <>
    { RSPrefs.typography.maximalLineLength &&
      <div className={ layoutStrategyStyles.readerSettingsGroup }>
        <StatefulSwitch 
          label={ Locale.reader.layoutStrategy.maxChars }
          onChange={ async (isSelected: boolean) => await updatePreference(isSelected) }
          isSelected={ maxLineLength?.isDisabled }
          isDisabled={ layoutStrategy !== ThLayoutStrategy.lineLength }
        />
      </div>
    }
    </>
  )
}