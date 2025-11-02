"use client";

import { useCallback, useMemo, Key } from "react";

import settingsStyles from "../assets/styles/playgroundSettings.module.css";

import { ThProgressionFormat, ThBreakpoints } from "@edrlab/thorium-web/core/preferences";
import { Heading } from "react-aria-components";

import { 
  useAppDispatch, 
  useAppSelector,
  useI18n,
  usePreferences,
  makeBreakpointsMap,
  setProgressionFormat,
  StatefulDropdown
} from "@edrlab/thorium-web/epub";

import classNames from "classnames";

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

  const progressions = useAppSelector(state => state.preferences.progressionFormat) || {};
  const profile = useAppSelector(state => state.reader.profile);
  const isWebPub = profile === "webPub";
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const currentBreakpoint = useAppSelector(state => state.theming.breakpoint);

  const profileKey = isWebPub 
    ? "webPub" 
    : isFXL 
      ? "fxl" 
      : "reflow";

  const dispatch = useAppDispatch();

  const breakpoints = useMemo(() => {
    const breakpoints = Object.entries(preferences?.theming?.breakpoints || {})
      .filter(([key, value]) => value !== null || key === ThBreakpoints.xLarge)
      .map(([key]) => key as ThBreakpoints);
    
    return breakpoints;
  }, [preferences]);

  const breakpointsMap = useMemo(() => {
    const formatPref = preferences?.theming?.progression?.format?.[profileKey];
    
    // Get the default value from preferences or fallback to default
    const defaultValue = formatPref?.default || {
      variants: [ThProgressionFormat.positionsPercentOfTotal],
      displayInImmersive: true,
      displayInFullscreen: false
    };
    
    // Create the breakpoints map using the helper
    return makeBreakpointsMap({
      defaultValue,
      fromEnum: ThProgressionFormat,
      pref: formatPref?.breakpoints,
      validateKey: "variants"
    });
  }, [preferences, profileKey]);

  const handleProgressionChange = useCallback((breakpoint: ThBreakpoints, key: Key | null) => {
    if (key) {
      const selectedOption = progressionOptions.find(opt => opt.id === key.toString());
      if (selectedOption) {
        dispatch(setProgressionFormat({
          key: profileKey,
          value: selectedOption.value,
          breakpoint
        }));
      }
    }
  }, [dispatch, profileKey]);

  if (breakpoints.length === 0) {
    return null;
  }

  return (
    <div className={ settingsStyles.readerSettingsGroup }>
      <Heading className={ settingsStyles.readerSettingsLabel }>
        { t("reader.readerSettings.progression.title") }
      </Heading>
      { breakpoints.map(breakpoint => {
        const breakpointValue = breakpointsMap[breakpoint];
        const storedValue = progressions?.[profileKey]?.breakpoints?.[breakpoint];
        
        // Get the default value from breakpoint config
        let breakpointDefault = ThProgressionFormat.positionsPercentOfTotal;
        if (breakpointValue) {
          if (breakpointValue.variants) {
            breakpointDefault = Array.isArray(breakpointValue.variants) 
              ? breakpointValue.variants[0] 
              : breakpointValue.variants;
          } else if (typeof breakpointValue === "string") {
            breakpointDefault = breakpointValue;
          }
        }
        
        // Priority: stored value > breakpoint default > positionsPercentOfTotal
        const currentValue = storedValue ?? breakpointDefault;

        const selectedOption = progressionOptions.find(opt => 
          opt.value === currentValue
        ) || progressionOptions[0];

        return (
          <StatefulDropdown 
            key={ breakpoint }
            standalone={ true }
            className={ settingsStyles.readerSettingsInlineDropdown }
            label={ `${ breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1) }:` }
            selectedKey={ selectedOption.id }
            isDisabled={ currentBreakpoint !== breakpoint }
            onSelectionChange={ (key) => handleProgressionChange(breakpoint, key) }
            items={ progressionOptions.map(option => ({
              id: option.id,
              label: t(option.label),
              value: option.value
            })) }
            compounds={{
              label: {
                className: settingsStyles.readerSettingsInlineDropdownLabel
              },
              button: {
                className: classNames(
                  settingsStyles.readerSettingsDropdownButton,
                  settingsStyles.readerSettingsInlineDropdownButton
                )
              }
            }}
          />
        );
      })}
    </div>
  );
};