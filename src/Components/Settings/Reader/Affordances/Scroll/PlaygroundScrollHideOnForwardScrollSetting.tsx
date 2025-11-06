"use client";

import { useCallback } from "react";

import { 
  StatefulSwitch,
  StatefulSwitchProps,
  useI18n,
  usePreferences,
  useAppDispatch,
  useAppSelector,
  setScrollAffordances
} from "@edrlab/thorium-web/epub";

export const PlaygroundScrollHideOnForwardScrollSetting = ({ standalone, label }: StatefulSwitchProps) => {
  const { t } = useI18n("playground");
  const { preferences } = usePreferences();

  const scroll = useAppSelector(state => state.settings.scroll);
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const isScroll = scroll && !isFXL;

  const scrollAffordances = useAppSelector(state => state.preferences.scrollAffordances);
  const hideOnForwardScroll = scrollAffordances?.hideOnForwardScroll ?? 
    preferences?.affordances?.scroll?.hideOnForwardScroll ?? false;

  const dispatch = useAppDispatch();

  const handleChange = useCallback((value: boolean) => {
    dispatch(setScrollAffordances({
      ...scrollAffordances,
      hideOnForwardScroll: value
    }));
  }, [dispatch, scrollAffordances]);

  return (
    <StatefulSwitch
      standalone={ standalone }
      isSelected={ hideOnForwardScroll }
      isDisabled={ !isScroll }
      onChange={ handleChange }
      label={ label || t("reader.readerSettings.scrollAffordances.hideOnForwardScroll") }
    />
  );
};
