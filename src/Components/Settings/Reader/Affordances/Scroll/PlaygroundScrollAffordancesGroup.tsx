"use client";

import { useCallback } from "react";

import settingsStyles from "../../../assets/styles/playgroundSettings.module.css";

import { readerPreferencesContainerKeys, ScrollAffordanceKeys } from "@/preferences/enums";

import { ThLayoutOptions } from "@edrlab/thorium-web/core/preferences";

import { 
  StatefulGroupWrapper, 
  useI18n, 
  useAppSelector, 
  useAppDispatch 
} from "@edrlab/thorium-web/epub";

import { Heading } from "react-aria-components";

import { PlaygroundScrollToggleOnMiddlePointerSetting } from "./PlaygroundScrollToggleOnMiddlePointerSetting";
import { PlaygroundScrollShowOnBackwardScrollSetting } from "./PlaygroundScrollShowOnBackwardScrollSetting";
import { PlaygroundScrollHideOnForwardScrollSetting } from "./PlaygroundScrollHideOnForwardScrollSetting";
import { PlaygroundScrollHintInImmersiveSetting } from "./PlaygroundScrollHintInImmersiveSetting";
import { PlaygroundAffordancesIndicator } from "../PlaygroundAffordancesIndicator";

import { setReaderPreferencesContainerKey } from "@/lib/customReducer";

import classNames from "classnames";

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
  const scroll = useAppSelector(state => state.settings.scroll);
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const isPaginated = !scroll || isFXL;

  const dispatch = useAppDispatch();

  const handleMoreClick = useCallback(() => {
    dispatch(setReaderPreferencesContainerKey(readerPreferencesContainerKeys.scrollAffordances));
  }, [dispatch]);

  if (isFXL) {
    return null;
  }

  return (
    <StatefulGroupWrapper<ScrollAffordanceKeys>
      label={ t("reader.readerSettings.scrollAffordances.title") }
      moreLabel={ t("reader.readerSettings.scrollAffordances.advanced.trigger") }
      moreTooltip={ t("reader.readerSettings.scrollAffordances.advanced.tooltip") }
      onPressMore={ handleMoreClick }
      componentsMap={ componentsMap }
      defaultPrefs={{
        main: [
          ScrollAffordanceKeys.ToggleOnMiddlePointer
        ],
        subPanel: [
          ScrollAffordanceKeys.ToggleOnMiddlePointer,
          ScrollAffordanceKeys.ShowOnBackwardScroll,
          ScrollAffordanceKeys.HideOnForwardScroll,
          ScrollAffordanceKeys.HintInImmersive
        ]
      }}
      compounds={{
        heading: (
          <Heading
            className={ classNames(
              settingsStyles.readerSettingsLabel,
              settingsStyles.readerSettingsGroupLabel,
              { [settingsStyles.readerSettingsGroupLabelDisabled]: isPaginated }
            ) }
          >
            { t("reader.readerSettings.scrollAffordances.title") }
          </Heading>
        )
      }}
    />
  );
};

export const PlaygroundScrollAffordancesGroupContainer = () => {
  const { t } = useI18n("playground");

  return (
    <>
      <PlaygroundAffordancesIndicator variant={ ThLayoutOptions.scroll } />
      <PlaygroundScrollToggleOnMiddlePointerSetting standalone={ true } label={ t("reader.readerSettings.scrollAffordances.toggleOnMiddlePointer") }/>
      <PlaygroundScrollShowOnBackwardScrollSetting standalone={ true } label={ t("reader.readerSettings.scrollAffordances.showOnBackwardScroll") }/>
      <PlaygroundScrollHideOnForwardScrollSetting standalone={ true } label={ t("reader.readerSettings.scrollAffordances.hideOnForwardScroll") }/>
      <PlaygroundScrollHintInImmersiveSetting standalone={ true } label={ t("reader.readerSettings.scrollAffordances.hintInImmersive") }/>
    </>
  );
};
