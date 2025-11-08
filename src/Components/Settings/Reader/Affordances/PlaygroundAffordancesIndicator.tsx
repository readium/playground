"use client";

import { useCallback } from "react";

import settingsStyles from "../../assets/styles/playgroundSettings.module.css";

import { Button } from "react-aria-components";

import { 
  useI18n,
  useEpubNavigator,
  useAppSelector, 
  useAppDispatch,
  setScroll
} from "@edrlab/thorium-web/epub";

export const PlaygroundAffordancesIndicator = ({ variant }: { variant?: "scroll" | "paginated" }) => {
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

  const getVariant = (variant: "scroll" | "paginated") => {
    if (variant === "scroll") return t("thorium-web:reader.settings.layout.scrolled").toLowerCase();
    else return t("thorium-web:reader.settings.layout.paginated").toLowerCase();
  }

  const shouldShowButton = (variant === "scroll" && !scroll) || (variant === "paginated" && scroll);

  return (
    <div className={ settingsStyles.readerSettingsAffordanceIndicator }>
      <p>{ t("playground:reader.readerSettings.affordanceSwitcher.indicator", { breakpoint, layout: isScroll ? getVariant("scroll") : getVariant("paginated") } ) }</p>
      { shouldShowButton && <Button
        className={ settingsStyles.readerSettingsAffordanceIndicatorButton }
        onPress={ async () => await handleSwitch() }
      >
        { t("playground:reader.readerSettings.affordanceSwitcher.switcher", { layout: getVariant(variant) }) }
      </Button> }
    </div>
  );
};