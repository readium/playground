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
} from "@edrlab/thorium-web/reader";

import { CustomKeys, PlaygroundActionsKeys } from "@/preferences/preferences";

export const PlaygroundReaderSettingsTrigger = ({ variant }: StatefulActionTriggerProps) => {
  const { preferences } = usePreferences<CustomKeys>();
  
  const profile = useAppSelector(state => state.reader.profile);
  const actionState = useAppSelector(state => profile ? state.actions.keys[profile][PlaygroundActionsKeys.readerSettings] : undefined);
  const dispatch = useAppDispatch();

  const { t } = useI18n("playground");
 
  const setOpen = (value: boolean) => {
    if (profile) {
      dispatch(setActionOpen({
        key: PlaygroundActionsKeys.readerSettings,
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