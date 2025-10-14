"use client";

import { layoutPresets } from "@/preferences/enums";
import { PlaygroundActionsKeys } from "@/preferences/preferences";

import AddColumnIcon from "./assets/icons/add_column_right.svg";
import FitIcon from "./assets/icons/fit_width.svg";
import FitPageWidthIcon from "./assets/icons/fit_page_width.svg";
import NewspaperIcon from "./assets/icons/newspaper.svg";
import RangeIcon from "./assets/icons/arrow_range.svg";
import TuneIcon from "./assets/icons/tune.svg";

import { 
  StatefulRadioGroup,
  useI18n,
  useAppSelector,
  useAppDispatch,
  setActionOpen
} from "@edrlab/thorium-web/epub";

import { PlaygroundLineLengths } from "./PlaygroundLineLengths";

import { useLineLengths } from "./hooks/useLineLengths";

export const PlaygroundLayoutPresetsGroup = () => {
  const layoutPreset = useAppSelector(state => state.custom.layoutPreset);

  const { updatePreset } = useLineLengths();

  const { t } = useI18n("playground");

  const dispatch = useAppDispatch();

  return(
    <>
    <StatefulRadioGroup 
      standalone={ true }
      label={ t("reader.layoutPresets.title") }
      orientation="horizontal"
      value={ layoutPreset }
      onChange={ async (val: string) => await updatePreset(val as layoutPresets) }
      onEscape={ () => dispatch(setActionOpen({ key: PlaygroundActionsKeys.layoutPresets, isOpen: false })) }
      items={[
        {
          id: layoutPresets.lineLength,
          icon: RangeIcon,
          label: t("reader.layoutPresets.lineLength"),
          value: layoutPresets.lineLength
        },
        {
          id: layoutPresets.margin,
          icon: FitIcon,
          label: t("reader.layoutPresets.margin"),
          value: layoutPresets.margin
        },
        {
          id: layoutPresets.fullWidth,
          icon: FitPageWidthIcon,
          label: t("reader.layoutPresets.fullWidth"),
          value: layoutPresets.fullWidth
        },
        {
          id: layoutPresets.columns,
          icon: AddColumnIcon,
          label: t("reader.layoutPresets.columns"),
          value: layoutPresets.columns
        },
        {
          id: layoutPresets.newspaper,
          icon: NewspaperIcon,
          label: t("reader.layoutPresets.newspaper"),
          value: layoutPresets.newspaper
        },
        {
          id: layoutPresets.custom,
          icon: TuneIcon,
          label: t("reader.layoutPresets.custom"),
          value: layoutPresets.custom
        }
      ]}
    />
    <PlaygroundLineLengths />
    </>
  )
}