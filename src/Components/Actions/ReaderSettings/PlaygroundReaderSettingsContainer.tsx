"use client";

import readerSettingsStyles from "../../Settings/assets/styles/playgroundSettings.module.css";

import { PlaygroundActionsKeys } from "@/preferences/preferences";

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
import { PlaygroundReaderSettingsGroup } from "@/Components/Settings/Reader/PlaygroundReaderSettings";

export const PlaygroundReaderSettingsContainer = ({ triggerRef }: StatefulActionContainerProps) => {
  const actionState = useAppSelector(state => state.actions.keys[PlaygroundActionsKeys.readerSettings]);
  const dispatch = useAppDispatch();
  
  const docking = useDocking(PlaygroundActionsKeys.readerSettings);
  const sheetType = docking.sheetType;

  const { t } = useI18n("playground");

  const setOpen = (value: boolean) => {    
    dispatch(setActionOpen({
      key: PlaygroundActionsKeys.readerSettings,
      isOpen: value
    }));

    // hover false otherwise it tends to stay on close button press…
    if (!value) dispatch(setHovering(false));
  }

  return(
    <>
    <StatefulSheetWrapper 
      sheetType={ sheetType }
      sheetProps={ {
        id: PlaygroundActionsKeys.readerSettings,
        triggerRef: triggerRef,
        heading: t("reader.readerSettings.heading"),
        className: readerSettingsStyles.readerSettings,
        placement: "bottom", 
        isOpen: actionState?.isOpen || false,
        onOpenChange: setOpen, 
        onClosePress: () => setOpen(false),
        docker: docking.getDocker(),
        scrollTopOnFocus: true
      } }
    >
      <PlaygroundReaderSettingsGroup />
    </StatefulSheetWrapper>
    </>
  )
}