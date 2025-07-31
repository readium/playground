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
} from "@edrlab/thorium-web/epub";

import { PlaygroundActionsKeys } from "@/preferences/preferences";

export const PlaygroundLayoutPresetsTrigger = ({ variant }: StatefulActionTriggerProps) => {
  const RSPrefs = usePreferences();
  
  const actionState = useAppSelector(state => state.actions.keys[PlaygroundActionsKeys.layoutPresets]);
  const dispatch = useAppDispatch();

  const { t } = useI18n("playground");
 
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
    { (variant && variant === ThActionsTriggerVariant.menu) 
      ? <StatefulOverflowMenuItem 
          label={ t("reader.layoutPresets.trigger") }
          SVGIcon={ LayoutIcon }
          shortcut={ RSPrefs.actions.keys[PlaygroundActionsKeys.layoutPresets].shortcut } 
          id={ PlaygroundActionsKeys.layoutPresets }
          onAction={ () => setOpen(!actionState?.isOpen) }
        />
      : <StatefulActionIcon 
          visibility={ RSPrefs.actions.keys[PlaygroundActionsKeys.layoutPresets].visibility }
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