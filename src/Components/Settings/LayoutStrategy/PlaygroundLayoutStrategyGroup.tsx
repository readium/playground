"use client";

import { useCallback, useEffect } from "react";

import Locale from "../../../resources/locales/en.json";

import { LayoutStrategy } from "@readium/navigator";

import FitIcon from "./assets/icons/fit_width.svg";
import RangeIcon from "./assets/icons/arrow_range.svg";
import AddColumnIcon from "./assets/icons/add_column_right.svg";

import { ThLayoutStrategy } from "@edrlab/thorium-web/core/preferences";

import { 
  StatefulRadioGroup,
  useEpubNavigator,
  useAppDispatch,
  useAppSelector,
  setLayoutStrategy
} from "@edrlab/thorium-web/epub";

import { PlaygroundLineLengths } from "./PlaygroundLineLengths";

export const PlaygroundLayoutStrategyGroup = () => {
  const layoutStrategy = useAppSelector(state => state.settings.layoutStrategy);
  const isScroll = useAppSelector(state => state.settings.scroll);
  const columnCount = useAppSelector(state => state.settings.columnCount);
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: string) => {
    await submitPreferences({ layoutStrategy: value as unknown as LayoutStrategy });

    dispatch(setLayoutStrategy(getSetting("layoutStrategy")));
  }, [submitPreferences, getSetting, dispatch]);

  useEffect(() => {
    const updateIfNeeded = async () => {
      if (columnCount !== "auto" && layoutStrategy === ThLayoutStrategy.columns) {
        await updatePreference(ThLayoutStrategy.lineLength);
      }
    };
    updateIfNeeded();
  }, [columnCount, layoutStrategy, updatePreference]);

  return(
    <>
    <StatefulRadioGroup 
      standalone={ true }
      label={ Locale.reader.layoutStrategy.title }
      orientation="horizontal"
      value={ layoutStrategy }
      onChange={ async (val: string) => await updatePreference(val) }
      items={[
        {
          icon: FitIcon,
          label: Locale.reader.layoutStrategy.margin,
          value: ThLayoutStrategy.margin,
        },
        {
          icon: RangeIcon,
          label: Locale.reader.layoutStrategy.lineLength,
          value: ThLayoutStrategy.lineLength,
        },
        {
          icon: AddColumnIcon,
          label: Locale.reader.layoutStrategy.columns,
          value: ThLayoutStrategy.columns,
          isDisabled: isScroll || columnCount !== "auto",
        }   
      ]}
    />
    <PlaygroundLineLengths />
    </>
  )
}