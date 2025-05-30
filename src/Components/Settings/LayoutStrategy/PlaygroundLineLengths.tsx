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
  setLineLength
} from "@edrlab/thorium-web/epub";

import { PlaygroundMaxChars } from "./PlaygroundMaxChars";
import { PlaygroundMinChars } from "./PlaygroundMinChars";

export const PlaygroundLineLengths = ({ standalone = true }: StatefulSettingsItemProps) => {
  const RSPrefs = usePreferences();
  const columnCount = useAppSelector(state => state.settings.columnCount);
  const layoutStrategy = useAppSelector(state => state.settings.layoutStrategy);
  const lineLength = useAppSelector(state => state.settings.lineLength);

  const dispatch = useAppDispatch();

  const { 
    getSetting,
    submitPreferences,
    preferencesEditor
  } = useEpubNavigator();

  const lineLengthRangeConfig = {
    range: preferencesEditor?.optimalLineLength.supportedRange || [20, 100],
    step: preferencesEditor?.optimalLineLength.step || 1
  }

  const optimalLineLength = lineLength?.optimal || RSPrefs.typography.optimalLineLength;
  const minLineLength = lineLength?.min?.chars || RSPrefs.typography.minimalLineLength || lineLengthRangeConfig.range[0];
  const maxLineLength = lineLength?.max?.chars || RSPrefs.typography.maximalLineLength || lineLengthRangeConfig.range[1];

  const updatePreference = useCallback(async (type: "min" | "optimal" | "max", value: number) => {
    switch(type) {
      case "min":
        await submitPreferences({
          minimalLineLength: value
        });
        dispatch(setLineLength({
          key: "min",
          value: getSetting("minimalLineLength")
        }));
        break;
      case "optimal":
        await submitPreferences({
          optimalLineLength: value, 
        });
        dispatch(setLineLength({
          key: "optimal",
          value: getSetting("optimalLineLength")
        }));
        break;
      case "max":
        await submitPreferences({
          maximalLineLength: value
        });
        dispatch(setLineLength({
          key: "max",
          value: getSetting("maximalLineLength")
        }));
        break;
      default:
        break;
    }
  }, [submitPreferences, getSetting, dispatch]);

  return(
    <>
    <StatefulNumberField
      standalone={ standalone }
      label={ Locale.reader.layoutStrategy.minimalLineLength.title }
      defaultValue={ getSetting("minimalLineLength") ?? lineLengthRangeConfig.range[0] }
      value={ minLineLength } 
      onChange={ async(value: number) => await updatePreference("min", value) } 
      steppers={{
        decrementLabel: Locale.reader.layoutStrategy.minimalLineLength.decrease,
        incrementLabel: Locale.reader.layoutStrategy.minimalLineLength.increase
      }}
      range={ [lineLengthRangeConfig.range[0], optimalLineLength] }
      step={ lineLengthRangeConfig.step }
      isDisabled={ layoutStrategy !== ThLayoutStrategy.columns && columnCount !== "2" }
    /> 
    <PlaygroundMinChars />

    <StatefulNumberField
      standalone={ standalone }
      label={ Locale.reader.layoutStrategy.optimalLineLength.title }
      defaultValue={ getSetting("optimalLineLength") } 
      value={ optimalLineLength } 
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
      value={ maxLineLength } 
      onChange={ async(value: number) => await updatePreference("max", value) }
      steppers={{
        decrementLabel: Locale.reader.layoutStrategy.maximalLineLength.decrease,
        incrementLabel: Locale.reader.layoutStrategy.maximalLineLength.increase
      }}
      range={ [optimalLineLength, lineLengthRangeConfig.range[1]] }
      step={ lineLengthRangeConfig.step }
      isDisabled={ layoutStrategy !== ThLayoutStrategy.lineLength }
    /> 
    <PlaygroundMaxChars />
    </>
  )
}