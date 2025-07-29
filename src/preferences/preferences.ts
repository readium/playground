"use client";

import { ThCollapsibilityVisibility } from "@edrlab/thorium-web/core/components";
import { 
  createPreferences, 
  defaultPreferences, 
  ThActionsKeys, 
  ThBreakpoints, 
  ThDockingTypes, 
  ThSheetTypes 
} from "@edrlab/thorium-web/core/preferences";

export enum PlaygroundActionsKeys {
  layoutPresets = "layoutPresets",
}

export const playgroundPreferences = createPreferences({
  ...defaultPreferences,
  actions: {
    reflowOrder: [
      ThActionsKeys.settings,
      ThActionsKeys.toc,
      ThActionsKeys.fullscreen,
      ThActionsKeys.jumpToPosition,
      PlaygroundActionsKeys.layoutPresets
    ],
    fxlOrder: [
      ThActionsKeys.settings,
      ThActionsKeys.toc,
      ThActionsKeys.jumpToPosition,
      ThActionsKeys.fullscreen,
    ],
    collapse: defaultPreferences.actions.collapse, 
    keys: {
      ...defaultPreferences.actions.keys,
      [PlaygroundActionsKeys.layoutPresets]: {
        visibility: ThCollapsibilityVisibility.overflow,
        shortcut: null,
        sheet: {
          defaultSheet: ThSheetTypes.popover,
          breakpoints: {
            [ThBreakpoints.compact]: ThSheetTypes.bottomSheet
          }
        },
        docked: {
          dockable: ThDockingTypes.none
        },
        snapped: {
          scrim: true,
          peekHeight: 50,
          minHeight: 30,
          maxHeight: 100
        }
      }
    }
  }
});