"use client";

import { ThPlugin } from "@edrlab/thorium-web/epub";
import { StatefulReaderWrapper, ReaderComponentProps } from "@edrlab/thorium-web/reader";

const epubPlugins = async (): Promise<ThPlugin[]> => {
  const { createDefaultPlugin } = await import("@edrlab/thorium-web/epub");
  const { PlaygroundActionsKeys } = await import("@/preferences/preferences");
  const { PlaygroundLayoutPresetsTrigger } = await import("./Actions/LayoutPresets/PlaygroundLayoutPresetsTrigger");
  const { PlaygroundLayoutPresetsContainer } = await import("./Actions/LayoutPresets/PlaygroundLayoutPresetsContainer");
  const { PlaygroundReaderSettingsTrigger } = await import("./Actions/ReaderSettings/PlaygroundReaderSettingsTrigger");
  const { PlaygroundReaderSettingsContainer } = await import("./Actions/ReaderSettings/PlaygroundReaderSettingsContainer");

  return [ createDefaultPlugin(), {
    id: "custom",
    name: "Custom Components",
    description: "Custom components for Readium Playground StatefulReader",
    version: "1.0.7",
    components: {
      actions: {
        [PlaygroundActionsKeys.layoutPresets]: {
          Trigger: PlaygroundLayoutPresetsTrigger,
          Target: PlaygroundLayoutPresetsContainer
        },
        [PlaygroundActionsKeys.readerSettings]: {
          Trigger: PlaygroundReaderSettingsTrigger,
          Target: PlaygroundReaderSettingsContainer
        }
      }
    }
  }];
};

export const CustomReader = (props: Omit<ReaderComponentProps, "plugins">) => {
  return (
    <StatefulReaderWrapper
      { ...props }
      plugins={{ epub: epubPlugins }}
    />
  );
};
