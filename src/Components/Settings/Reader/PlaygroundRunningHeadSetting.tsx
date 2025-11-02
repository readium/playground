"use client";

import { useCallback, useMemo, Key } from "react";

import settingsStyles from "../assets/styles/playgroundSettings.module.css";

import { ThRunningHeadFormat, ThBreakpoints } from "@edrlab/thorium-web/core/preferences";
import { Heading } from "react-aria-components";

import { 
  useAppDispatch, 
  useAppSelector,
  useI18n,
  usePreferences,
  makeBreakpointsMap,
  setRunningHeadFormat,
  StatefulDropdown
} from "@edrlab/thorium-web/epub";

import classNames from "classnames";

interface RunningHeadOption {
  id: string;
  label: string;
  value: ThRunningHeadFormat;
}

const runningHeadOptions: RunningHeadOption[] = [
  { 
    id: "title", 
    label: "reader.readerSettings.runningHead.format.title", 
    value: ThRunningHeadFormat.title 
  },
  { 
    id: "chapter", 
    label: "reader.readerSettings.runningHead.format.chapter", 
    value: ThRunningHeadFormat.chapter 
  },
  // Uncomment when titleAndChapter is added to the enum
  // { 
  //   id: "titleAndChapter", 
  //   label: "reader.readerSettings.runningHead.format.titleAndChapter", 
  //   value: ThRunningHeadFormat.titleAndChapter 
  // },
  { 
    id: "none", 
    label: "reader.readerSettings.runningHead.format.none", 
    value: ThRunningHeadFormat.none 
  }
];

export const PlaygroundRunningHeadSetting = () => {
  const { t } = useI18n("playground");
  const { preferences } = usePreferences();

  const runningHeads = useAppSelector(state => state.preferences.runningHeadFormat) || {};
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
    const formatPref = preferences?.theming?.header?.runningHead?.format?.[profileKey];
    
    // Get the default value from preferences or fallback to default
    const defaultValue = formatPref?.default || {
      variants: [ThRunningHeadFormat.title],
      displayInImmersive: true,
      displayInFullscreen: false
    };
    
    // Create the breakpoints map using the helper
    const breakpointsMap = makeBreakpointsMap({
      defaultValue,
      fromEnum: ThRunningHeadFormat,
      pref: formatPref?.breakpoints,
      validateKey: "variants"
    });
    
    return breakpointsMap;
  }, [preferences, profileKey]);

  const handleRunningHeadChange = useCallback((breakpoint: ThBreakpoints, key: Key | null) => {
    if (key) {
      const selectedOption = runningHeadOptions.find(opt => opt.id === key.toString());
      if (selectedOption) {
        dispatch(setRunningHeadFormat({
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
        { t("reader.readerSettings.runningHead.title") }
      </Heading>
      { breakpoints.map(breakpoint => {
        const breakpointValue = breakpointsMap[breakpoint];
        const storedValue = runningHeads?.[profileKey]?.breakpoints?.[breakpoint];
        
        // Get the default value from breakpoint config
        let breakpointDefault = ThRunningHeadFormat.title;
        if (breakpointValue) {
          if (breakpointValue.variants) {
            breakpointDefault = Array.isArray(breakpointValue.variants) 
              ? breakpointValue.variants[0] 
              : breakpointValue.variants;
          } else if (typeof breakpointValue === "string") {
            breakpointDefault = breakpointValue;
          }
        }
        
        // Priority: stored value > breakpoint default > title
        const currentValue = storedValue ?? breakpointDefault;

        const selectedOption = runningHeadOptions.find(opt => 
          opt.value === currentValue
        ) || runningHeadOptions[0];

        return (
          <StatefulDropdown 
            key={ breakpoint }
            standalone={ true }
            className={ settingsStyles.readerSettingsInlineDropdown }
            label={ `${ breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1) }:` }
            selectedKey={ selectedOption.id }
            isDisabled={ currentBreakpoint !== breakpoint }
            onSelectionChange={ (key) => handleRunningHeadChange(breakpoint, key) }
            items={ runningHeadOptions.map(option => ({
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