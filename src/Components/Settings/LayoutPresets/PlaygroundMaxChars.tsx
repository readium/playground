"use client";

import { useCallback } from "react";

import Locale from "../../../resources/locales/en.json";

import { 
  StatefulSwitch,
  useAppSelector,
  usePreferences
} from "@edrlab/thorium-web/epub";
import { useLineLengths } from "./hooks/useLineLengths";

export const PlaygroundMaxChars = () => {
  const RSPrefs = usePreferences();
  const maxLineLength = useAppSelector(state => state.settings.lineLength?.max);
  const { toggleLineLength } = useLineLengths();
  
  const handleToggle = useCallback(async (isSelected: boolean) => {
    await toggleLineLength("max", isSelected);
  }, [toggleLineLength]);

  return(
    <>
    { RSPrefs.typography.maximalLineLength &&
      <StatefulSwitch 
        label={ Locale.reader.layoutPresets.maxChars }
        onChange={ handleToggle }
        isSelected={ maxLineLength?.isDisabled ?? false }
      />
    }
    </>
  )
}