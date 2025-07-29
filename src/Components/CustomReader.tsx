"use client";

import { PlaygroundActionsKeys } from "@/preferences/preferences";

import { ThPlugin, createDefaultPlugin, StatefulReader, StatefulReaderProps } from "@edrlab/thorium-web/epub";
import { PlaygroundLayoutPresetsTrigger } from "./Actions/LayoutPresets/PlaygroundLayoutPresetsTrigger";
import { PlaygroundLayoutPresetsContainer } from "./Actions/LayoutPresets/PlaygroundLayoutPresetsContainer";

export const CustomReader = ({
  rawManifest,
  selfHref
}: Omit<StatefulReaderProps, "plugins"> ) => {
    const defaultPlugin: ThPlugin = createDefaultPlugin();
    const customPlugins: ThPlugin[] = [ defaultPlugin, {
      id: "custom",
      name: "Custom Components",
      description: "Custom components for Readium Playground StatefulReader",
      version: "0.10.0",
      components: {
        actions: {
          [PlaygroundActionsKeys.layoutPresets]: {
            Trigger: PlaygroundLayoutPresetsTrigger,
            Target: PlaygroundLayoutPresetsContainer
          }
        }
      }
    }];
    
    return (
      <>
        <StatefulReader 
          rawManifest={ rawManifest } 
          selfHref={ selfHref } 
          plugins={ customPlugins }
        />
      </>
    )

}