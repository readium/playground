"use client";

import { useCallback } from "react";

import settingsStyles from "../../../assets/styles/playgroundSettings.module.css";

import { readerPreferencesContainerKeys, PaginatedAffordanceKeys } from "@/preferences/enums";

import { ThLayoutOptions } from "@edrlab/thorium-web/core/preferences";

import { 
  StatefulGroupWrapper, 
  useI18n, 
  useAppDispatch, 
  useAppSelector
} from "@edrlab/thorium-web/epub";

import { Heading } from "react-aria-components";

import { PlaygroundPaginatedAffordanceVariantSetting } from "./PlaygroundPaginatedAffordanceVariantSetting";
import { PlaygroundPaginatedAffordanceHintSetting } from "./PlaygroundPaginatedAffordanceHintSetting";
import { PlaygroundPaginatedAffordanceDiscardSetting } from "./PlaygroundPaginatedAffordanceDiscardSetting";
import { PlaygroundAffordancesIndicator } from "../PlaygroundAffordancesIndicator";

import { setReaderPreferencesContainerKey } from "@/lib/customReducer";

import classNames from "classnames";

const componentsMap = {
  [PaginatedAffordanceKeys.Variant]: {
    Comp: PlaygroundPaginatedAffordanceVariantSetting,
    standalone: false
  },
  [PaginatedAffordanceKeys.Hint]: {
    Comp: PlaygroundPaginatedAffordanceHintSetting,
    standalone: false
  },
  [PaginatedAffordanceKeys.Discard]: {
    Comp: PlaygroundPaginatedAffordanceDiscardSetting,
    standalone: false
  }
};

export const PlaygroundPaginatedAffordancesGroup = () => {
  const { t } = useI18n("playground");
  const scroll = useAppSelector(state => state.settings.scroll);
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const isScroll = scroll && !isFXL;

  const dispatch = useAppDispatch();

  const handleMoreClick = useCallback(() => {
    dispatch(setReaderPreferencesContainerKey(readerPreferencesContainerKeys.paginatedAffordances));
  }, [dispatch]);

  return (
    <StatefulGroupWrapper<PaginatedAffordanceKeys>
      label={ t("reader.readerSettings.paginatedAffordance.title") }
      moreLabel={ t("reader.readerSettings.paginatedAffordance.advanced.trigger") }
      moreTooltip={ t("reader.readerSettings.paginatedAffordance.advanced.tooltip") }
      onPressMore={ handleMoreClick }
      componentsMap={ componentsMap }
      defaultPrefs={{
        main: [PaginatedAffordanceKeys.Variant],
        subPanel: [
          PaginatedAffordanceKeys.Variant,
          PaginatedAffordanceKeys.Hint, 
          PaginatedAffordanceKeys.Discard
        ]
      }}
      compounds={{
        heading: (
          <Heading
            className={ classNames(
              settingsStyles.readerSettingsLabel,
              settingsStyles.readerSettingsGroupLabel,
              { [settingsStyles.readerSettingsGroupLabelDisabled]: isScroll }
            ) }
          >
            { t("reader.readerSettings.paginatedAffordance.title") }
          </Heading>
        )
      }}
    />
  );
};

export const PlaygroundPaginatedAffordancesGroupContainer = () => {  
  return (
    <>
      <PlaygroundAffordancesIndicator variant={ ThLayoutOptions.paginated }/>
      <PlaygroundPaginatedAffordanceVariantSetting />
      <PlaygroundPaginatedAffordanceHintSetting />
      <PlaygroundPaginatedAffordanceDiscardSetting />
    </>
  );
};
