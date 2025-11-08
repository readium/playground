"use client";

import { useCallback } from "react";

import settingsStyles from "../../assets/styles/playgroundSettings.module.css";

import { ThLayoutOptions } from "@edrlab/thorium-web/core/preferences";

import { Button } from "react-aria-components";

import { 
  useI18n,
  useEpubNavigator,
  useAppSelector, 
  useAppDispatch,
  setScroll
} from "@edrlab/thorium-web/epub";

export const PlaygroundAffordancesIndicator = ({ variant }: { variant?: ThLayoutOptions }) => {
  const { t } = useI18n();
  const scroll = useAppSelector(state => state.settings.scroll);
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const isScroll = scroll && !isFXL;
  const breakpoint = useAppSelector(state => state.theming.breakpoint);

  const dispatch = useAppDispatch();

  const { submitPreferences, getSetting } = useEpubNavigator();

  const handleSwitch = useCallback(async () => {
    await submitPreferences({
      scroll: !scroll
    });
    dispatch(setScroll(getSetting("scroll")));
  }, [scroll, dispatch, submitPreferences, getSetting]);

  const getVariant = (variant: ThLayoutOptions) => {
    if (variant === ThLayoutOptions.scroll) return t("thorium-web:reader.settings.layout.scrolled").toLowerCase();
    else return t("thorium-web:reader.settings.layout.paginated").toLowerCase();
  }

  const shouldShowButton = (variant === ThLayoutOptions.scroll && !scroll) || (variant === ThLayoutOptions.paginated && scroll);

  return (
    <div className={ settingsStyles.readerSettingsAffordanceIndicator }>
      <p>{ t("playground:reader.readerSettings.affordanceSwitcher.indicator", { breakpoint, layout: isScroll ? getVariant(ThLayoutOptions.scroll) : getVariant(ThLayoutOptions.paginated) } ) }</p>

      { shouldShowButton && <Button
        className={ settingsStyles.readerSettingsAffordanceIndicatorButton }
        onPress={ async () => await handleSwitch() }
      >
        { t("playground:reader.readerSettings.affordanceSwitcher.switcher", { layout: getVariant(variant) }) }
      </Button> }
    </div>
  );
};