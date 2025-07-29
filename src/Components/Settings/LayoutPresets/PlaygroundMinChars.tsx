"use client";

import { useCallback } from "react";

import Locale from "../../../resources/locales/en.json";

import { 
  StatefulSwitch,
  useAppSelector,
  usePreferences
} from "@edrlab/thorium-web/epub";
import { useLineLengths } from "./hooks/useLineLengths";

export const PlaygroundMinChars = () => {
  const RSPrefs = usePreferences();
  const minLineLength = useAppSelector(state => state.settings.lineLength?.min);
  const { toggleLineLength } = useLineLengths();
  
  const handleToggle = useCallback(async (isSelected: boolean) => {
    await toggleLineLength("min", isSelected);
  }, [toggleLineLength]);

  return(
    <>
    { RSPrefs.typography.minimalLineLength &&
      <StatefulSwitch 
        label={ Locale.reader.layoutPresets.minChars }
        onChange={ handleToggle }
        isSelected={ minLineLength?.isDisabled ?? false }
      />
    }
    </>
  )
}