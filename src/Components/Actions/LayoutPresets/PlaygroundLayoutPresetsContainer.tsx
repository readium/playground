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
} from "@edrlab/thorium-web/reader";
import { PlaygroundLayoutPresetsGroup } from "../../Settings/LayoutPresets/PlaygroundLayoutPresets";

export const PlaygroundLayoutPresetsContainer = ({ triggerRef }: StatefulActionContainerProps) => {
  const profile = useAppSelector(state => state.reader.profile);
  const actionState = useAppSelector(state => profile ? state.actions.keys[profile][PlaygroundActionsKeys.layoutPresets] : undefined);
  const dispatch = useAppDispatch();
  
  const docking = useDocking(PlaygroundActionsKeys.layoutPresets);
  const sheetType = docking.sheetType;

  const { t } = useI18n("playground");

  const setOpen = (value: boolean) => {
    if (profile) {
      dispatch(setActionOpen({
        key: PlaygroundActionsKeys.layoutPresets,
        isOpen: value,
        profile
      }));
    }

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
        heading: t("reader.layoutPresets.heading"),
        className: readerSettingsStyles.readerSettings,
        placement: "bottom", 
        isOpen: actionState?.isOpen || false,
        onOpenChange: setOpen, 
        onClosePress: () => setOpen(false),
        docker: docking.getDocker(),
        scrollTopOnFocus: true
      } }
    >
      <PlaygroundLayoutPresetsGroup />
    </StatefulSheetWrapper>
    </>
  )
}