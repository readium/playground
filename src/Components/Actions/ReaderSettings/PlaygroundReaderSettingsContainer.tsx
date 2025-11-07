"use client";

import { useCallback, useEffect } from "react";

import readerSettingsStyles from "../../Settings/assets/styles/playgroundSettings.module.css";

import { PlaygroundActionsKeys } from "@/preferences/preferences";
import { readerPreferencesContainerKeys } from "@/preferences/enums";
import { setReaderPreferencesContainerKey } from "@/lib/customReducer";
import { ThSheetHeaderVariant } from "@edrlab/thorium-web/core/preferences";

import { PlaygroundLanguageSetting } from "@/Components/Settings/Reader/PlaygroundLanguageSetting";
import { PlaygroundProgressionSetting } from "@/Components/Settings/Reader/PlaygroundProgressionSetting";
import { PlaygroundRunningHeadSetting } from "@/Components/Settings/Reader/PlaygroundRunningHeadSetting";
import { PlaygroundPaginatedAffordancesGroup } from "@/Components/Settings/Reader/Affordances/Paginated/PlaygroundPaginatedAffordancesGroup";
import { PlaygroundScrollAffordancesGroup } from "@/Components/Settings/Reader/Affordances/Scroll/PlaygroundScrollAffordancesGroup";
import { PlaygroundPaginatedAffordancesGroupContainer } from "@/Components/Settings/Reader/Affordances/Paginated/PlaygroundPaginatedAffordancesGroup";
import { PlaygroundScrollAffordancesGroupContainer } from "@/Components/Settings/Reader/Affordances/Scroll/PlaygroundScrollAffordancesGroup";
import { PlaygroundAffordancesIndicator } from "@/Components/Settings/PlaygroundAffordancesIndicator";

import { 
  StatefulActionContainerProps,
  StatefulSheetWrapper,
  useDocking,
  useI18n,
  setActionOpen,
  useAppDispatch,
  useAppSelector,
  setHovering
} from "@edrlab/thorium-web/epub";

export const PlaygroundReaderSettingsContainer = ({ triggerRef }: StatefulActionContainerProps) => {
  const actionState = useAppSelector(state => state.actions.keys[PlaygroundActionsKeys.readerSettings]);
  const contains = useAppSelector(state => state.custom.readerPreferencesContainerKey);
  const dispatch = useAppDispatch();
  
  const docking = useDocking(PlaygroundActionsKeys.readerSettings);
  const sheetType = docking.sheetType;

  const { t } = useI18n("playground");

  const setOpen = useCallback((isOpen: boolean) => {    
    dispatch(setActionOpen({
      key: PlaygroundActionsKeys.readerSettings,
      isOpen
    }));
    if (!isOpen) dispatch(setHovering(false));
  }, [dispatch]);

  const setInitial = useCallback(() => {
    dispatch(setReaderPreferencesContainerKey(readerPreferencesContainerKeys.initial));
  }, [dispatch]);

  const renderContent = useCallback(() => {
    switch (contains) {
      case readerPreferencesContainerKeys.paginatedAffordances:
        return <PlaygroundPaginatedAffordancesGroupContainer />;
      
      case readerPreferencesContainerKeys.scrollAffordances:
        return <PlaygroundScrollAffordancesGroupContainer />;

      case readerPreferencesContainerKeys.initial:
      default:
        return (
          <>
            <PlaygroundAffordancesIndicator />
            <PlaygroundLanguageSetting />
            <PlaygroundRunningHeadSetting />
            <PlaygroundProgressionSetting />
            <PlaygroundPaginatedAffordancesGroup />
            <PlaygroundScrollAffordancesGroup />
          </>
        );
    }
  }, [contains]);

  const getHeading = useCallback(() => {
    switch (contains) {
      case readerPreferencesContainerKeys.paginatedAffordances:
        return t("reader.readerSettings.paginatedAffordance.title");
      
      case readerPreferencesContainerKeys.scrollAffordances:
        return t("reader.readerSettings.scrollAffordances.title");

      case readerPreferencesContainerKeys.initial:
      default:
        return t("reader.readerSettings.heading");
    }
  }, [contains, t]);

  const getHeaderVariant = useCallback(() => {
    switch (contains) {
      case readerPreferencesContainerKeys.paginatedAffordances:
      case readerPreferencesContainerKeys.scrollAffordances:
        return ThSheetHeaderVariant.previous;
      
      case readerPreferencesContainerKeys.initial:
      default:
        return ThSheetHeaderVariant.close;
    }
  }, [contains]);

  // Handle escape key to return to initial state
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && contains !== readerPreferencesContainerKeys.initial) {
        event.stopPropagation();
        setInitial();
      }
    };

    document.addEventListener("keydown", handleEscape, true);
    return () => {
      document.removeEventListener("keydown", handleEscape, true);
    };
  }, [contains, setInitial]);

  // Reset when closed
  useEffect(() => {
    if (!actionState?.isOpen) {
      setInitial();
    }
  }, [actionState?.isOpen, setInitial]);

  return(
    <>
    <StatefulSheetWrapper
      sheetType={ sheetType }
      sheetProps={ {
        id: PlaygroundActionsKeys.readerSettings,
        triggerRef,
        heading: getHeading(),
        headerVariant: getHeaderVariant(),
        className: readerSettingsStyles.readerSettings,
        placement: "bottom",
        isOpen: actionState?.isOpen || false,
        onOpenChange: setOpen,
        onClosePress: () => contains === readerPreferencesContainerKeys.initial 
            ? setOpen(false) 
            : setInitial(),
        docker: docking.getDocker(),
        resetFocus: contains,
        scrollTopOnFocus: true,
        dismissEscapeKeyClose: contains !== readerPreferencesContainerKeys.initial
      }}
    >
      { renderContent() }
    </StatefulSheetWrapper>
    </>
  )
}