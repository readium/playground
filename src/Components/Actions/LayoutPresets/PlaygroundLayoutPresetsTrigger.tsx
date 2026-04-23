"use client";

import LayoutIcon from "./assets/icons/fit_page_width.svg";

import { ThActionsTriggerVariant } from "@edrlab/thorium-web/core/components";
import { 
  StatefulActionTriggerProps,
  StatefulActionIcon,
  StatefulOverflowMenuItem,
  usePreferences,
  useI18n,
  useAppDispatch,
  useAppSelector,
  setActionOpen,
  setHovering
} from "@edrlab/thorium-web/reader";

import { CustomKeys, PlaygroundActionsKeys } from "@/preferences/preferences";

export const PlaygroundLayoutPresetsTrigger = ({ variant }: StatefulActionTriggerProps) => {
  const { preferences } = usePreferences<CustomKeys>();
  
  const profile = useAppSelector(state => state.reader.profile);
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const actionState = useAppSelector(state => profile ? state.actions.keys[profile][PlaygroundActionsKeys.layoutPresets] : undefined);
  const dispatch = useAppDispatch();
  const { t } = useI18n("playground");

  if (profile !== "epub" || isFXL) return null;
 
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
    { (variant && variant === ThActionsTriggerVariant.menu) 
      ? <StatefulOverflowMenuItem 
          label={ t("reader.layoutPresets.trigger") }
          SVGIcon={ LayoutIcon }
          shortcut={ preferences.actions.keys[PlaygroundActionsKeys.layoutPresets].shortcut } 
          id={ PlaygroundActionsKeys.layoutPresets }
          onAction={ () => setOpen(!actionState?.isOpen) }
        />
      : <StatefulActionIcon 
          visibility={ preferences.actions.keys[PlaygroundActionsKeys.layoutPresets].visibility }
          aria-label={ t("reader.layoutPresets.trigger") }
          placement="bottom" 
          tooltipLabel={ t("reader.layoutPresets.tooltip") } 
          onPress={ () => setOpen(!actionState?.isOpen) }
        >
          <LayoutIcon aria-hidden="true" focusable="false" />
        </StatefulActionIcon>
    }
    </>
  )
}