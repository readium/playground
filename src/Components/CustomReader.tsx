"use client";

import { useEffect } from "react";
import { ThPlugin } from "@edrlab/thorium-web/epub";
import { StatefulReaderWrapper, ReaderComponentProps, ReaderProfile, ThReduxPreferencesAdapter } from "@edrlab/thorium-web/reader";
import { defaultAudioPreferences } from "@edrlab/thorium-web/core/preferences";
import { playgroundPreferences, CustomKeys } from "@/preferences/preferences";
import { store } from "./CustomProviders";

import "@edrlab/thorium-web/misc/styles";

const adapter = new ThReduxPreferencesAdapter<CustomKeys>(store, playgroundPreferences);

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
    version: "1.4.0",
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

export const CustomReader = (props: Omit<ReaderComponentProps<ReaderProfile | null>, "plugins">) => {
  useEffect(() => {
    if (props.profile === "epub") {
      import("@edrlab/thorium-web/epub/styles");
    } else if (props.profile === "webPub") {
      import("@edrlab/thorium-web/webpub/styles");
    } else if (props.profile === "audio") {
      import("@edrlab/thorium-web/audio/styles");
    }
  }, [props.profile]);

  return (
    <StatefulReaderWrapper
      { ...props }
      plugins={{ epub: epubPlugins }}
      preferences={
        props.profile === "audio"
          ? { initialPreferences: defaultAudioPreferences }
          : { initialPreferences: playgroundPreferences, adapter }
      }
      i18n={{
        ns: ["thorium-shared", "thorium-web", "playground"]
      }}
    />
  );
};
