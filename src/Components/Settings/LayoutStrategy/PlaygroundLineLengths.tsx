"use client";

import { useCallback } from "react";

import Locale from "../../../resources/locales/en.json";

import { ThLayoutStrategy } from "@edrlab/thorium-web/core/preferences";

import { 
  StatefulSettingsItemProps,
  StatefulNumberField,
  useEpubNavigator,
  usePreferences,
  useAppDispatch,
  useAppSelector,
  setTmpLineLengths,
  setTmpMaxChars,
  setTmpMinChars
} from "@edrlab/thorium-web/epub";

import { PlaygroundMaxChars } from "./PlaygroundMaxChars";
import { PlaygroundMinChars } from "./PlaygroundMinChars";

export const PlaygroundLineLengths = ({ standalone = true }: StatefulSettingsItemProps) => {
  const RSPrefs = usePreferences();
  const columnCount = useAppSelector(state => state.settings.columnCount);
  const layoutStrategy = useAppSelector(state => state.settings.layoutStrategy);
  const tmpLineLengths = useAppSelector(state => state.settings.tmpLineLengths);
  const min = tmpLineLengths[0];
  const optimal = tmpLineLengths[1];
  const max = tmpLineLengths[2];

  const dispatch = useAppDispatch();

  const { 
    getSetting,
    submitPreferences,
    preferencesEditor
  } = useEpubNavigator();

  const lineLengthRangeConfig = {
    range: preferencesEditor?.lineLength.supportedRange || [20, 100],
    step: preferencesEditor?.lineLength.step || 1
  }

  const updatePreference = useCallback(async (type: "min" | "optimal" | "max", value: number) => {
    switch(type) {
      case "min":
        await submitPreferences({
          minimalLineLength: value, 
          optimalLineLength: optimal, 
          maximalLineLength: max
        });
        dispatch(setTmpMinChars(false));
        break;
      case "optimal":
        await submitPreferences({
          minimalLineLength: min, 
          optimalLineLength: value, 
          maximalLineLength: max
        });
        break;
      case "max":
        await submitPreferences({
          minimalLineLength: min, 
          optimalLineLength: optimal, 
          maximalLineLength: value
        });
        dispatch(setTmpMaxChars(false));
        break;
      default:
        break;
    }
    const appliedValues = [
      getSetting("minimalLineLength"),
      getSetting("optimalLineLength"),
      getSetting("maximalLineLength")
    ];
    dispatch(setTmpLineLengths(appliedValues));
  }, [submitPreferences, getSetting, min, optimal, max, dispatch]);

  return(
    <>
    <StatefulNumberField
      standalone={ standalone }
      label={ Locale.reader.layoutStrategy.minimalLineLength.title }
      defaultValue={ getSetting("minimalLineLength") ?? lineLengthRangeConfig.range[0] }
      value={ tmpLineLengths[0] } 
      onChange={ async(value: number) => await updatePreference("min", value) } 
      steppers={{
        decrementLabel: Locale.reader.layoutStrategy.minimalLineLength.decrease,
        incrementLabel: Locale.reader.layoutStrategy.minimalLineLength.increase
      }}
      range={ [lineLengthRangeConfig.range[0], optimal || RSPrefs.typography.optimalLineLength] }
      step={ lineLengthRangeConfig.step }
      isDisabled={ layoutStrategy !== ThLayoutStrategy.columns && columnCount !== "2" }
    /> 
    <PlaygroundMinChars />

    <StatefulNumberField
      standalone={ standalone }
      label={ Locale.reader.layoutStrategy.optimalLineLength.title }
      defaultValue={ getSetting("optimalLineLength") } 
      value={ tmpLineLengths[1] } 
      onChange={ async(value: number) => await updatePreference("optimal", value) } 
      steppers={{
        decrementLabel: Locale.reader.layoutStrategy.optimalLineLength.decrease,
        incrementLabel: Locale.reader.layoutStrategy.optimalLineLength.increase
      }}
      range={ lineLengthRangeConfig.range }
      step={ lineLengthRangeConfig.step }
    /> 
    
    <StatefulNumberField
      standalone={ standalone }
      label={ Locale.reader.layoutStrategy.maximalLineLength.title }
      defaultValue={ getSetting("maximalLineLength") || lineLengthRangeConfig.range[1] } 
      value={ tmpLineLengths[2] } 
      onChange={ async(value: number) => await updatePreference("max", value) }
      steppers={{
        decrementLabel: Locale.reader.layoutStrategy.maximalLineLength.decrease,
        incrementLabel: Locale.reader.layoutStrategy.maximalLineLength.increase
      }}
      range={ [optimal || RSPrefs.typography.optimalLineLength, lineLengthRangeConfig.range[1]] }
      step={ lineLengthRangeConfig.step }
      isDisabled={ layoutStrategy !== ThLayoutStrategy.lineLength }
    /> 
    <PlaygroundMaxChars />
    </>
  )
}