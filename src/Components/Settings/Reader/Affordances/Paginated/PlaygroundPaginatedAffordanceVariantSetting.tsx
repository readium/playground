"use client";

import { useCallback, useMemo } from "react";

import { 
  ThArrowVariant,
  ThBreakpoints
} from "@edrlab/thorium-web/core/preferences";

import { 
  useAppDispatch, 
  useAppSelector,
  useI18n,
  usePreferences,
  makeBreakpointsMap,
  setPaginatedAffordance,
  StatefulDropdownProps
} from "@edrlab/thorium-web/epub";

import { PlaygroundDisclosureGroup } from "../../../PlaygroundDisclosureGroup";

interface VariantOption {
  id: string;
  label: string;
  value: ThArrowVariant;
}

const variantOptions: VariantOption[] = [
  { 
    id: "layered", 
    label: "reader.readerSettings.paginatedAffordance.variant.layered", 
    value: ThArrowVariant.layered 
  },
  { 
    id: "stacked", 
    label: "reader.readerSettings.paginatedAffordance.variant.stacked", 
    value: ThArrowVariant.stacked 
  },
  { 
    id: "none", 
    label: "reader.readerSettings.paginatedAffordance.variant.none", 
    value: ThArrowVariant.none 
  }
];

export const PlaygroundPaginatedAffordanceVariantSetting = ({ standalone }: StatefulDropdownProps) => {
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
      variant: ThArrowVariant.layered,
      discard: "none",
      hint: "none"
    };

    return makeBreakpointsMap({
      defaultValue,
      fromEnum: ThArrowVariant,
      pref: paginatedPref?.breakpoints,
      validateKey: "variant"
    });
  }, [preferences, profileKey]);

  // Prepare values for PlaygroundDisclosureGroup
  const variantValues = useMemo(() => {
    const result: Record<string, ThArrowVariant> = {};
    
    breakpoints.forEach(breakpoint => {
      const breakpointValue = breakpointsMap[breakpoint];
      const storedValue = paginatedAffordances[profileKey]?.breakpoints?.[breakpoint]?.variant;
      
      // Get the default value from breakpoint config
      let breakpointDefault = ThArrowVariant.layered;
      if (breakpointValue) {
        if ('variant' in breakpointValue) {
          breakpointDefault = breakpointValue.variant;
        } else if (typeof breakpointValue === "string") {
          breakpointDefault = breakpointValue as ThArrowVariant;
        }
      }
      
      // Priority: stored value > breakpoint default > default
      result[breakpoint] = storedValue ?? breakpointDefault;
    });
    
    return result;
  }, [breakpoints, breakpointsMap, paginatedAffordances, profileKey]);

  const handleVariantChange = useCallback((breakpoint: ThBreakpoints, value: ThArrowVariant) => {
    // Get the current state for the profile, or an empty object if it doesn't exist
    const currentProfileState = paginatedAffordances[profileKey] || {};
    
    // Get the current state for the specific breakpoint, or an empty object if it doesn't exist
    const currentBreakpointState = currentProfileState.breakpoints?.[breakpoint] || {};
    
    // Dispatch the update with the new variant value
    dispatch(setPaginatedAffordance({
      key: profileKey,
      value: {
        ...currentBreakpointState,  // Keep any existing properties
        variant: value  // Update the variant
      },
      breakpoint  // The breakpoint to update
    }));
  }, [dispatch, paginatedAffordances, profileKey]);

  if (isWebPub) {
    return null;
  }

  if (breakpoints.length === 0) {
    return null;
  }

  return (
    <PlaygroundDisclosureGroup<ThArrowVariant>
      id="paginated-affordance-variant"
      title={ t("reader.readerSettings.paginatedAffordance.variant.title") }
      standalone={ standalone }
      breakpoints={ breakpoints }
      value={ variantValues }
      isDisabled={ isScroll }
      options={ variantOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))}
      onChange={ handleVariantChange }
    />
  );
};