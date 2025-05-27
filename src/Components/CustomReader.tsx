"use client";

import { PlaygroundActionsKeys } from "@/preferences/preferences";

import { ThPlugin, createDefaultPlugin, StatefulReader, StatefulReaderProps } from "@edrlab/thorium-web/epub";
import { PlaygroundLayoutStrategyTrigger } from "./Actions/LayoutStrategy/PlaygroundLayoutStrategyTrigger";
import { PlaygroundLayoutStrategyContainer } from "./Actions/LayoutStrategy/PlaygroundLayoutStrategyContainer";

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
          [PlaygroundActionsKeys.layoutStrategy]: {
            Trigger: PlaygroundLayoutStrategyTrigger,
            Target: PlaygroundLayoutStrategyContainer
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