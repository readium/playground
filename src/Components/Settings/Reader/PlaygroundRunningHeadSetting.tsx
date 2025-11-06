"use client";

import { useCallback, useMemo } from "react";

import { ThRunningHeadFormat, ThBreakpoints } from "@edrlab/thorium-web/core/preferences";

import { 
  useAppDispatch, 
  useAppSelector,
  useI18n,
  usePreferences,
  makeBreakpointsMap,
  setRunningHeadFormat
} from "@edrlab/thorium-web/epub";

import { PlaygroundDisclosureGroup } from "../PlaygroundDisclosureGroup";

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

  const rawRunningHeads = useAppSelector(state => state.preferences.runningHeadFormat);
  const runningHeads = useMemo(() => rawRunningHeads ?? {}, [rawRunningHeads]);
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
    const formatPref = preferences?.theming?.header?.runningHead?.format?.[profileKey];
    const defaultValue = formatPref?.default || {
      variants: [ThRunningHeadFormat.title],
      displayInImmersive: true,
      displayInFullscreen: false
    };
    
    return makeBreakpointsMap({
      defaultValue,
      fromEnum: ThRunningHeadFormat,
      pref: formatPref?.breakpoints,
      validateKey: "variants"
    });
  }, [preferences, profileKey]);

  // Prepare values for PlaygroundDisclosureGroup
  const runningHeadValues = useMemo(() => {
    const result: Record<string, ThRunningHeadFormat> = {};
    
    breakpoints.forEach(breakpoint => {
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
      result[breakpoint] = storedValue ?? breakpointDefault;
    });
    
    return result;
  }, [breakpoints, breakpointsMap, runningHeads, profileKey]);

  const handleRunningHeadChange = useCallback((breakpoint: ThBreakpoints, value: ThRunningHeadFormat) => {
    dispatch(setRunningHeadFormat({
      key: profileKey,
      value,
      breakpoint
    }));
  }, [dispatch, profileKey]);

  if (breakpoints.length === 0) {
    return null;
  }

  return (
    <PlaygroundDisclosureGroup<ThRunningHeadFormat>
      id="running-head-format"
      title={ t("reader.readerSettings.runningHead.title") }
      breakpoints={ breakpoints }
      value={ runningHeadValues }
      options={ runningHeadOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))}
      onChange={ handleRunningHeadChange }
    />
  );
};