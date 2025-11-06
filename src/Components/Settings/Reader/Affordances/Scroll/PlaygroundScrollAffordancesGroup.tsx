"use client";

import { useCallback } from "react";

import { readerPreferencesContainerKeys, ScrollAffordanceKeys } from "@/preferences/enums";

import { StatefulGroupWrapper, useI18n, useAppSelector, useAppDispatch } from "@edrlab/thorium-web/epub";

import { PlaygroundScrollToggleOnMiddlePointerSetting } from "./PlaygroundScrollToggleOnMiddlePointerSetting";
import { PlaygroundScrollShowOnBackwardScrollSetting } from "./PlaygroundScrollShowOnBackwardScrollSetting";
import { PlaygroundScrollHideOnForwardScrollSetting } from "./PlaygroundScrollHideOnForwardScrollSetting";
import { PlaygroundScrollHintInImmersiveSetting } from "./PlaygroundScrollHintInImmersiveSetting";

import { setReaderPreferencesContainerKey } from "@/lib/customReducer";

const componentsMap = {
  [ScrollAffordanceKeys.ToggleOnMiddlePointer]: {
    Comp: PlaygroundScrollToggleOnMiddlePointerSetting
  },
  [ScrollAffordanceKeys.ShowOnBackwardScroll]: {
    Comp: PlaygroundScrollShowOnBackwardScrollSetting
  },
  [ScrollAffordanceKeys.HideOnForwardScroll]: {
    Comp: PlaygroundScrollHideOnForwardScrollSetting
  },
  [ScrollAffordanceKeys.HintInImmersive]: {
    Comp: PlaygroundScrollHintInImmersiveSetting
  }
};

export const PlaygroundScrollAffordancesGroup = () => {
  const { t } = useI18n("playground");
  const dispatch = useAppDispatch();
  
  const isFXL = useAppSelector(state => state.publication.isFXL);

  const handleMoreClick = useCallback(() => {
    dispatch(setReaderPreferencesContainerKey(readerPreferencesContainerKeys.scrollAffordances));
  }, [dispatch]);

  if (isFXL) {
    return null;
  }

  return (
    <StatefulGroupWrapper<ScrollAffordanceKeys>
      heading={ t("reader.readerSettings.scrollAffordances.title") }
      moreLabel={ t("reader.readerSettings.scrollAffordances.advanced.trigger") }
      moreTooltip={ t("reader.readerSettings.scrollAffordances.advanced.tooltip") }
      onPressMore={ handleMoreClick }
      componentsMap={ componentsMap }
      defaultPrefs={{
        main: [
          ScrollAffordanceKeys.HintInImmersive
        ],
        subPanel: [
          ScrollAffordanceKeys.HintInImmersive,
          ScrollAffordanceKeys.ToggleOnMiddlePointer,
          ScrollAffordanceKeys.ShowOnBackwardScroll,
          ScrollAffordanceKeys.HideOnForwardScroll
        ]
      }}
    />
  );
};

export const PlaygroundScrollAffordancesGroupContainer = () => {
  const { t } = useI18n("playground");

  return (
    <>
      <PlaygroundScrollHintInImmersiveSetting standalone={ true } label={ t("reader.readerSettings.scrollAffordances.hintInImmersive") }/>
      <PlaygroundScrollShowOnBackwardScrollSetting standalone={ true } label={ t("reader.readerSettings.scrollAffordances.showOnBackwardScroll") }/>
      <PlaygroundScrollHideOnForwardScrollSetting standalone={ true } label={ t("reader.readerSettings.scrollAffordances.hideOnForwardScroll") }/>
      <PlaygroundScrollToggleOnMiddlePointerSetting standalone={ true }/>
    </>
  );
};
