"use client";

import { useCallback } from "react";

import { 
  StatefulSwitch,
  useAppSelector,
  usePreferences,
  useI18n
} from "@edrlab/thorium-web/epub";
import { useLineLengths } from "./hooks/useLineLengths";

export const PlaygroundMinChars = () => {
  const RSPrefs = usePreferences();
  const minLineLength = useAppSelector(state => state.settings.lineLength?.min);
  const { toggleLineLength } = useLineLengths();
  const { t } = useI18n("playground");
  
  const handleToggle = useCallback(async (isSelected: boolean) => {
    await toggleLineLength("min", isSelected);
  }, [toggleLineLength]);

  return(
    <>
    { RSPrefs.typography.minimalLineLength &&
      <StatefulSwitch 
        label={ t("reader.layoutPresets.minChars") }
        onChange={ handleToggle }
        isSelected={ minLineLength?.isDisabled ?? false }
      />
    }
    </>
  )
}