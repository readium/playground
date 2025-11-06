"use client";

import { useCallback, useMemo, Key } from "react";

import { 
  ThBreakpoints,
  ThPaginatedAffordancePrefValue,
  ThArrowVariant
} from "@edrlab/thorium-web/core/preferences";

import { 
  useAppDispatch, 
  useAppSelector,
  useI18n,
  usePreferences,
  makeBreakpointsMap,
  setPaginatedAffordance
} from "@edrlab/thorium-web/epub";

import { PlaygroundDisclosureGroup } from "../../../PlaygroundDisclosureGroup";

enum DiscardValue {
  None = "none",
  Navigation = "navigation",
  Immersive = "immersive",
  Fullscreen = "fullscreen"
}

interface DiscardOption {
  id: string;
  label: string;
  value: DiscardValue;
}

const discardOptions: DiscardOption[] = [
  { 
    id: "none", 
    label: "reader.readerSettings.paginatedAffordance.discard.none", 
    value: DiscardValue.None 
  },
  { 
    id: "navigation", 
    label: "reader.readerSettings.paginatedAffordance.discard.navigation", 
    value: DiscardValue.Navigation
  },
  { 
    id: "immersive", 
    label: "reader.readerSettings.paginatedAffordance.discard.immersive", 
    value: DiscardValue.Immersive
  },
  { 
    id: "fullscreen", 
    label: "reader.readerSettings.paginatedAffordance.discard.fullscreen", 
    value: DiscardValue.Fullscreen
  }
];

export const PlaygroundPaginatedAffordanceDiscardSetting = () => {
  const { t } = useI18n("playground");
  const { preferences } = usePreferences();

  const rawPaginatedAffordances = useAppSelector(state => state.preferences.paginatedAffordances);
  const paginatedAffordances = useMemo(() => rawPaginatedAffordances ?? {}, [rawPaginatedAffordances]);
  const profile = useAppSelector(state => state.reader.profile);
  const isWebPub = profile === "webPub";
  const scroll = useAppSelector(state => state.settings.scroll);
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const isScroll = scroll && !isFXL;

  const profileKey = isFXL ? "fxl" : "reflow";
  
  const dispatch = useAppDispatch();

  const breakpoints = useMemo(() => {
    return Object.entries(preferences?.theming?.breakpoints || {})
      .filter(([key, value]) => value !== null || key === ThBreakpoints.xLarge)
      .map(([key]) => key as ThBreakpoints);
  }, [preferences]);

  const breakpointsMap = useMemo(() => {
    const paginatedPref = preferences?.affordances.paginated[profileKey];
    
    const defaultValue = paginatedPref?.default || {
      variant: "layered",
      discard: "none",
      hint: "none"
    };

    return makeBreakpointsMap({
      defaultValue,
      fromEnum: String,
      pref: paginatedPref?.breakpoints,
      validateKey: "discard"
    });
  }, [preferences, profileKey]);

  // Prepare values for PlaygroundDisclosureGroup
  const discardValues = useMemo(() => {
    const result: Record<string, string> = {};
    
    breakpoints.forEach(breakpoint => {
      const breakpointValue = breakpointsMap[breakpoint];
      const storedValue = paginatedAffordances[profileKey]?.breakpoints?.[breakpoint]?.discard;
      
      // Get the default value from breakpoint config
      let breakpointDefault = "none";
      if (breakpointValue) {
        if ('discard' in breakpointValue) {
          const discardValue = breakpointValue.discard;
          // Handle case where discard might be an array
          breakpointDefault = Array.isArray(discardValue) ? discardValue[0] || "none" : discardValue || "none";
        } else if (typeof breakpointValue === "string") {
          breakpointDefault = breakpointValue;
        }
      }
      
      // Priority: stored value > breakpoint default > default
      const finalValue = storedValue ?? breakpointDefault;
      result[breakpoint] = Array.isArray(finalValue) ? finalValue[0] || "none" : finalValue || "none";
    });
    
    return result;
  }, [breakpoints, breakpointsMap, paginatedAffordances, profileKey]);

  const handleDiscardChange = useCallback((breakpoint: ThBreakpoints, key: Key | null) => {
    if (!key) return;
    
    const selectedOption = discardOptions.find(opt => opt.id === key.toString());
    if (!selectedOption) return;
    
    const currentState = paginatedAffordances[profileKey] || {};
    const currentBreakpointState = breakpoint 
      ? { ...(currentState.breakpoints?.[breakpoint] || {}) }
      : { ...(currentState.default || {}) };
    
    // Convert to array if not "none"
    const discardValue = selectedOption.value === DiscardValue.None 
      ? DiscardValue.None 
      : [selectedOption.value as "navigation" | "immersive" | "fullscreen"];
    
    // Only update the discard property, preserve others and ensure required properties exist
    const updatedValue: ThPaginatedAffordancePrefValue = {
      variant: currentBreakpointState.variant || ThArrowVariant.layered,
      ...currentBreakpointState,
      discard: discardValue
    };
    
    dispatch(setPaginatedAffordance({
      key: profileKey,
      value: updatedValue,
      breakpoint
    }));
  }, [dispatch, paginatedAffordances, profileKey]);

  if (isWebPub) {
    return null;
  }

  if (breakpoints.length === 0) {
    return null;
  }

  return (
    <PlaygroundDisclosureGroup<string>
      id="paginated-affordance-discard"
      title={ t("reader.readerSettings.paginatedAffordance.discard.title") }
      breakpoints={ breakpoints }
      value={ discardValues }
      isDisabled={ isScroll }
      options={ discardOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))}
      onChange={ handleDiscardChange }
    />
  );
};
