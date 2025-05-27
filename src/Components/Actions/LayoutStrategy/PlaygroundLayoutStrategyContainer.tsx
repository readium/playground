"use client";

import Locale from "../../../resources/locales/en.json";

import layoutStrategyStyles from "../../Settings/LayoutStrategy/assets/styles/layoutStrategy.module.css";

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
import { PlaygroundLayoutStrategyGroup } from "../../Settings/LayoutStrategy/PlaygroundLayoutStrategyGroup";

export const PlaygroundLayoutStrategyContainer = ({ triggerRef }: StatefulActionContainerProps) => {
  const actionState = useAppSelector(state => state.actions.keys[PlaygroundActionsKeys.layoutStrategy]);
  const dispatch = useAppDispatch();
  
  const docking = useDocking(PlaygroundActionsKeys.layoutStrategy);
  const sheetType = docking.sheetType;

  const setOpen = (value: boolean) => {    
    dispatch(setActionOpen({
      key: PlaygroundActionsKeys.layoutStrategy,
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
        id: PlaygroundActionsKeys.layoutStrategy,
        triggerRef: triggerRef,
        heading: Locale.reader.layoutStrategy.heading,
        className: layoutStrategyStyles.readerSettings,
        placement: "bottom", 
        isOpen: actionState?.isOpen || false,
        onOpenChange: setOpen, 
        onClosePress: () => setOpen(false),
        docker: docking.getDocker()
      } }
    >
      <PlaygroundLayoutStrategyGroup />
    </StatefulSheetWrapper>
    </>
  )
}