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

enum HintValue {
  None = "none",
  ImmersiveChange = "immersiveChange",
  FullscreenChange = "fullscreenChange",
  LayoutChange = "layoutChange"
}

interface HintOption {
  id: string;
  label: string;
  value: HintValue;
}

const hintOptions: HintOption[] = [
  { 
    id: "immersiveChange", 
    label: "reader.readerSettings.paginatedAffordance.hint.immersiveChange", 
    value: HintValue.ImmersiveChange
  },
  { 
    id: "fullscreenChange", 
    label: "reader.readerSettings.paginatedAffordance.hint.fullscreenChange", 
    value: HintValue.FullscreenChange
  },
  { 
    id: "layoutChange", 
    label: "reader.readerSettings.paginatedAffordance.hint.layoutChange", 
    value: HintValue.LayoutChange
  },
  { 
    id: "none", 
    label: "reader.readerSettings.paginatedAffordance.hint.none", 
    value: HintValue.None 
  }
];

export const PlaygroundPaginatedAffordanceHintSetting = () => {
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
      validateKey: "hint"
    });
  }, [preferences, profileKey]);

  // Prepare values for PlaygroundDisclosureGroup
  const hintValues = useMemo(() => {
    const result: Record<string, string> = {};
    
    breakpoints.forEach(breakpoint => {
      const breakpointValue = breakpointsMap[breakpoint];
      const storedValue = paginatedAffordances[profileKey]?.breakpoints?.[breakpoint]?.hint;
      
      // Get the default value from breakpoint config
      let breakpointDefault = "none";
      if (breakpointValue) {
        if ('hint' in breakpointValue) {
          const hintValue = breakpointValue.hint;
          // Handle case where hint might be an array
          breakpointDefault = Array.isArray(hintValue) ? hintValue[0] || "none" : hintValue || "none";
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

  const handleHintChange = useCallback((breakpoint: ThBreakpoints, key: Key | null) => {
    if (!key) return;
    
    const selectedOption = hintOptions.find(opt => opt.id === key.toString());
    if (!selectedOption) return;
    
    const currentState = paginatedAffordances[profileKey] || {};
    const currentBreakpointState = breakpoint 
      ? { ...(currentState.breakpoints?.[breakpoint] || {}) }
      : { ...(currentState.default || {}) };
    
    // Convert to array if not "none"
    const hintValue = selectedOption.value === HintValue.None 
      ? HintValue.None 
      : [selectedOption.value];
    
    // Only update the hint property, preserve others and ensure required properties exist
    const updatedValue: ThPaginatedAffordancePrefValue = {
      variant: currentBreakpointState.variant || ThArrowVariant.layered,
      ...currentBreakpointState,
      hint: hintValue
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
      id="paginated-affordance-hint"
      title={ t("reader.readerSettings.paginatedAffordance.hint.title") }
      breakpoints={ breakpoints }
      value={ hintValues }
      isDisabled={ isScroll }
      options={ hintOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))}
      onChange={ handleHintChange }
    />
  );
};
