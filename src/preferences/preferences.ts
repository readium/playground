"use client";

import { ThCollapsibilityVisibility } from "@edrlab/thorium-web/core/components";
import { 
  createPreferences, 
  CustomizableKeys, 
  defaultPreferences, 
  ThActionsKeys, 
  ThBackLinkVariant, 
  ThBreakpoints, 
  ThDockingTypes, 
  ThSheetTypes 
} from "@edrlab/thorium-web/core/preferences";

export enum PlaygroundActionsKeys {
  layoutPresets = "layoutPresets",
  readerSettings = "readerSettings"
}

export type CustomKeys = CustomizableKeys & {
  action: ThActionsKeys | PlaygroundActionsKeys;
};

export const playgroundPreferences = createPreferences<CustomKeys>({
  ...defaultPreferences,
  theming: {
    ...defaultPreferences.theming,
    header: {
      ...defaultPreferences.theming.header,
      backLink: {
        variant: ThBackLinkVariant.custom,
        href: "/",
        content: {
          type: "img",
          src: "/images/ReadiumLogo.png"
        }
      }
    },
  },
  actions: {
    reflowOrder: [
      ThActionsKeys.settings,
      ThActionsKeys.toc,
      ThActionsKeys.fullscreen,
      ThActionsKeys.jumpToPosition,
      PlaygroundActionsKeys.layoutPresets,
      PlaygroundActionsKeys.readerSettings
    ],
    fxlOrder: [
      ThActionsKeys.settings,
      ThActionsKeys.toc,
      ThActionsKeys.jumpToPosition,
      ThActionsKeys.fullscreen,
      PlaygroundActionsKeys.readerSettings
    ],
    webPubOrder: defaultPreferences.actions.webPubOrder,
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
          dockable: ThDockingTypes.none,
        },
        snapped: {
          scrim: true,
          peekHeight: 50,
          minHeight: 30,
          maxHeight: 100
        }
      },
      [PlaygroundActionsKeys.readerSettings]: {
        visibility: ThCollapsibilityVisibility.overflow,
        shortcut: null,
        sheet: {
          defaultSheet: ThSheetTypes.popover,
          breakpoints: {
            [ThBreakpoints.compact]: ThSheetTypes.bottomSheet
          }
        },
        docked: {
          dockable: ThDockingTypes.both,
          dragIndicator: false,
          width: 360,
          minWidth: 320,
          maxWidth: 450
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