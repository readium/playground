"use client";

import { useCallback } from "react";

import { readerPreferencesContainerKeys, PaginatedAffordanceKeys } from "@/preferences/enums";

import { ThLayoutOptions } from "@edrlab/thorium-web/core/preferences";

import { 
  StatefulGroupWrapper, 
  useI18n, 
  useAppDispatch 
} from "@edrlab/thorium-web/epub";

import { PlaygroundPaginatedAffordanceVariantSetting } from "./PlaygroundPaginatedAffordanceVariantSetting";
import { PlaygroundPaginatedAffordanceHintSetting } from "./PlaygroundPaginatedAffordanceHintSetting";
import { PlaygroundPaginatedAffordanceDiscardSetting } from "./PlaygroundPaginatedAffordanceDiscardSetting";
import { PlaygroundAffordancesIndicator } from "../PlaygroundAffordancesIndicator";

import { setReaderPreferencesContainerKey } from "@/lib/customReducer";

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

  const dispatch = useAppDispatch();

  const handleMoreClick = useCallback(() => {
    dispatch(setReaderPreferencesContainerKey(readerPreferencesContainerKeys.paginatedAffordances));
  }, [dispatch]);

  return (
    <StatefulGroupWrapper<PaginatedAffordanceKeys>
      heading={ t("reader.readerSettings.paginatedAffordance.title") }
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
