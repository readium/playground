"use client";

import SettingsIcon from "./assets/icons/settings.svg";

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

import { CustomKeys, PlaygroundActionsKeys } from "@/preferences/preferences";

export const PlaygroundReaderSettingsTrigger = ({ variant }: StatefulActionTriggerProps) => {
  const { preferences } = usePreferences<CustomKeys>();
  
  const actionState = useAppSelector(state => state.actions.keys[PlaygroundActionsKeys.readerSettings]);
  const dispatch = useAppDispatch();

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
    { (variant && variant === ThActionsTriggerVariant.menu) 
      ? <StatefulOverflowMenuItem 
          label={ t("reader.readerSettings.trigger") }
          SVGIcon={ SettingsIcon }
          shortcut={ preferences.actions.keys[PlaygroundActionsKeys.readerSettings].shortcut } 
          id={ PlaygroundActionsKeys.readerSettings }
          onAction={ () => setOpen(!actionState?.isOpen) }
        />
      : <StatefulActionIcon 
          visibility={ preferences.actions.keys[PlaygroundActionsKeys.readerSettings].visibility }
          aria-label={ t("reader.readerSettings.trigger") }
          placement="bottom" 
          tooltipLabel={ t("reader.readerSettings.tooltip") } 
          onPress={ () => setOpen(!actionState?.isOpen) }
        >
          <SettingsIcon aria-hidden="true" focusable="false" />
        </StatefulActionIcon>
    }
    </>
  )
}