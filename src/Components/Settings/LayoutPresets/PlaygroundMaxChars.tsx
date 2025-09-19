"use client";

import { useCallback } from "react";

import { 
  StatefulSwitch,
  useAppSelector,
  usePreferences,
  useI18n
} from "@edrlab/thorium-web/epub";
import { useLineLengths } from "./hooks/useLineLengths";

export const PlaygroundMaxChars = () => {
  const { preferences } = usePreferences();
  const maxLineLength = useAppSelector(state => state.settings.lineLength?.max);
  const { toggleLineLength } = useLineLengths();
  const { t } = useI18n("playground");
  
  const handleToggle = useCallback(async (isSelected: boolean) => {
    await toggleLineLength("max", isSelected);
  }, [toggleLineLength]);

  return(
    <>
    { preferences.typography.maximalLineLength &&
      <StatefulSwitch 
        label={ t("reader.layoutPresets.maxChars") }
        onChange={ handleToggle }
        isSelected={ maxLineLength?.isDisabled ?? false }
      />
    }
    </>
  )
}