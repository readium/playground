"use client";

import Locale from "../../../resources/locales/en.json";

import layoutPresetsStyles from "../../Settings/LayoutPresets/assets/styles/layoutPresets.module.css";

import { PlaygroundActionsKeys } from "@/preferences/preferences";

import { 
  StatefulActionContainerProps,
  StatefulSheetWrapper,
  useDocking,
  setActionOpen,
  useAppDispatch,
  useAppSelector,
  setHovering
} from "@edrlab/thorium-web/epub";
import { PlaygroundLayoutPresetsGroup } from "../../Settings/LayoutPresets/PlaygroundLayoutPresets";

export const PlaygroundLayoutPresetsContainer = ({ triggerRef }: StatefulActionContainerProps) => {
  const actionState = useAppSelector(state => state.actions.keys[PlaygroundActionsKeys.layoutPresets]);
  const dispatch = useAppDispatch();
  
  const docking = useDocking(PlaygroundActionsKeys.layoutPresets);
  const sheetType = docking.sheetType;

  const setOpen = (value: boolean) => {    
    dispatch(setActionOpen({
      key: PlaygroundActionsKeys.layoutPresets,
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
        id: PlaygroundActionsKeys.layoutPresets,
        triggerRef: triggerRef,
        heading: Locale.reader.layoutPresets.heading,
        className: layoutPresetsStyles.readerSettings,
        placement: "bottom", 
        isOpen: actionState?.isOpen || false,
        onOpenChange: setOpen, 
        onClosePress: () => setOpen(false),
        docker: docking.getDocker()
      } }
    >
      <PlaygroundLayoutPresetsGroup />
    </StatefulSheetWrapper>
    </>
  )
}