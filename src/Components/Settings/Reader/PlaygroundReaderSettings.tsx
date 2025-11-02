import { PlaygroundLanguageSetting } from "./PlaygroundLanguageSetting";
import { PlaygroundProgressionSetting } from "./PlaygroundProgressionSetting";
import { PlaygroundRunningHeadSetting } from "./PlaygroundRunningHeadSetting";

export const PlaygroundReaderSettingsGroup = () => {
  return(
    <>
    <PlaygroundLanguageSetting />
    <PlaygroundRunningHeadSetting />
    <PlaygroundProgressionSetting />
    </>
  )
}