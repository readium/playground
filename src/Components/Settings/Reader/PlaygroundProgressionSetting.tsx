"use client";

import { useCallback, useMemo } from "react";

import { ThProgressionFormat, ThBreakpoints } from "@edrlab/thorium-web/core/preferences";

import { 
  useAppDispatch, 
  useAppSelector,
  useI18n,
  usePreferences,
  makeBreakpointsMap,
  setProgressionFormat
} from "@edrlab/thorium-web/epub";

import { PlaygroundDisclosureGroup } from "../PlaygroundDisclosureGroup";

interface ProgressionOption {
  id: string;
  label: string;
  value: ThProgressionFormat;
}

const progressionOptions: ProgressionOption[] = [
  { 
    id: "positionsPercentOfTotal", 
    label: "reader.readerSettings.progression.format.positionsPercentOfTotal", 
    value: ThProgressionFormat.positionsPercentOfTotal 
  },
  { 
    id: "positionsOfTotal", 
    label: "reader.readerSettings.progression.format.positionsOfTotal", 
    value: ThProgressionFormat.positionsOfTotal 
  },
  { 
    id: "positions", 
    label: "reader.readerSettings.progression.format.positions", 
    value: ThProgressionFormat.positions 
  },
  { 
    id: "overallProgression", 
    label: "reader.readerSettings.progression.format.overallProgression", 
    value: ThProgressionFormat.overallProgression 
  },
  { 
    id: "positionsLeft", 
    label: "reader.readerSettings.progression.format.positionsLeft", 
    value: ThProgressionFormat.positionsLeft 
  },
  { 
    id: "readingOrderIndex", 
    label: "reader.readerSettings.progression.format.readingOrderIndex", 
    value: ThProgressionFormat.readingOrderIndex 
  },
  { 
    id: "resourceProgression", 
    label: "reader.readerSettings.progression.format.resourceProgression", 
    value: ThProgressionFormat.resourceProgression 
  },
  { 
    id: "progressionOfResource", 
    label: "reader.readerSettings.progression.format.progressionOfResource", 
    value: ThProgressionFormat.progressionOfResource 
  },
  { 
    id: "none", 
    label: "reader.readerSettings.progression.format.none", 
    value: ThProgressionFormat.none 
  }
];

export const PlaygroundProgressionSetting = () => {
  const { t } = useI18n("playground");
  const { preferences } = usePreferences();

  const rawProgressions = useAppSelector(state => state.preferences.progressionFormat);
  const progressions = useMemo(() => rawProgressions ?? {}, [rawProgressions]);
  const profile = useAppSelector(state => state.reader.profile);
  const isWebPub = profile === "webPub";
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const profileKey = isWebPub ? "webPub" : isFXL ? "fxl" : "reflow";
  const dispatch = useAppDispatch();

  const breakpoints = useMemo(() => {
    return Object.entries(preferences?.theming?.breakpoints || {})
      .filter(([key, value]) => value !== null || key === ThBreakpoints.xLarge)
      .map(([key]) => key as ThBreakpoints);
  }, [preferences]);

  const breakpointsMap = useMemo(() => {
    const formatPref = preferences?.theming?.progression?.format?.[profileKey];
    
    const defaultValue = formatPref?.default || {
      variants: [ThProgressionFormat.positionsPercentOfTotal],
      displayInImmersive: true,
      displayInFullscreen: false
    };
    
    return makeBreakpointsMap({
      defaultValue,
      fromEnum: ThProgressionFormat,
      pref: formatPref?.breakpoints,
      validateKey: "variants"
    });
  }, [preferences, profileKey]);

  // Prepare values for PlaygroundDisclosureGroup
  const progressionValues = useMemo(() => {
    const result: Record<string, ThProgressionFormat> = {};
    
    breakpoints.forEach(breakpoint => {
      const breakpointValue = breakpointsMap[breakpoint];
      const storedValue = progressions?.[profileKey]?.breakpoints?.[breakpoint];
      
      // Get the default value from breakpoint config
      let breakpointDefault = ThProgressionFormat.positionsPercentOfTotal;
      if (breakpointValue) {
        // Handle the case where variants might be an array or a single value
        if ('variants' in breakpointValue) {
          const variants = Array.isArray(breakpointValue.variants) 
            ? breakpointValue.variants 
            : [breakpointValue.variants];
          breakpointDefault = variants[0] || ThProgressionFormat.positionsPercentOfTotal;
        } else if (typeof breakpointValue === "string") {
          // If it's a string, use it directly
          breakpointDefault = breakpointValue as ThProgressionFormat;
        }
      }
      
      // Priority: stored value > breakpoint default > default
      const finalValue = storedValue ?? breakpointDefault;
      
      // Ensure we always have a valid ThProgressionFormat
      if (Array.isArray(finalValue)) {
        result[breakpoint] = finalValue[0] || ThProgressionFormat.positionsPercentOfTotal;
      } else {
        result[breakpoint] = finalValue as ThProgressionFormat;
      }
    });
    
    return result;
  }, [breakpoints, breakpointsMap, progressions, profileKey]);

  const handleProgressionChange = useCallback((breakpoint: ThBreakpoints, value: ThProgressionFormat) => {
    dispatch(setProgressionFormat({
      key: profileKey,
      value,
      breakpoint
    }));
  }, [dispatch, profileKey]);

  if (breakpoints.length === 0) {
    return null;
  }

  return (
    <PlaygroundDisclosureGroup<ThProgressionFormat>
      id="progression-format"
      title={ t("reader.readerSettings.progression.title") }
      breakpoints={ breakpoints }
      value={ progressionValues }
      options={ progressionOptions.map(option => ({
        ...option,
        label: t(option.label)
      })) }
      onChange={ handleProgressionChange }
    />
  );
};