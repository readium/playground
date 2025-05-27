"use client";

import Locale from "../../../resources/locales/en.json";

import LayoutIcon from "./assets/icons/fit_page_width.svg";

import { ThActionsTriggerVariant } from "@edrlab/thorium-web/core/components";
import { 
  StatefulActionTriggerProps,
  StatefulActionIcon,
  StatefulOverflowMenuItem,
  usePreferences,
  useAppDispatch,
  useAppSelector,
  setActionOpen,
  setHovering
} from "@edrlab/thorium-web/epub";

import { PlaygroundActionsKeys } from "@/preferences/preferences";

export const PlaygroundLayoutStrategyTrigger = ({ variant }: StatefulActionTriggerProps) => {
  const RSPrefs = usePreferences();
  
  const actionState = useAppSelector(state => state.actions.keys[PlaygroundActionsKeys.layoutStrategy]);
  const dispatch = useAppDispatch();

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
    { (variant && variant === ThActionsTriggerVariant.menu) 
      ? <StatefulOverflowMenuItem 
          label={ Locale.reader.layoutStrategy.trigger }
          SVGIcon={ LayoutIcon }
          shortcut={ RSPrefs.actions.keys[PlaygroundActionsKeys.layoutStrategy].shortcut } 
          id={ PlaygroundActionsKeys.layoutStrategy }
          onAction={ () => setOpen(!actionState?.isOpen) }
        />
      : <StatefulActionIcon 
          visibility={ RSPrefs.actions.keys[PlaygroundActionsKeys.layoutStrategy].visibility }
          aria-label={ Locale.reader.layoutStrategy.trigger }
          placement="bottom" 
          tooltipLabel={ Locale.reader.layoutStrategy.tooltip } 
          onPress={ () => setOpen(!actionState?.isOpen) }
        >
          <LayoutIcon aria-hidden="true" focusable="false" />
        </StatefulActionIcon>
    }
    </>
  )
}