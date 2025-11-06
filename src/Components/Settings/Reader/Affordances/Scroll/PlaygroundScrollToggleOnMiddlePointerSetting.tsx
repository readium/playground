"use client";

import { useCallback, useMemo } from "react";

import { 
  StatefulDropdown,
  StatefulDropdownProps,
  useI18n,
  usePreferences,
  useAppDispatch,
  useAppSelector,
  setScrollAffordances
} from "@edrlab/thorium-web/epub";

interface ToggleOption {
  id: string;
  label: string;
  value: "none" | "tap" | "click";
}

const options: ToggleOption[] = [
  { 
    id: "none", 
    label: "reader.readerSettings.scrollAffordances.toggleOnMiddlePointer.none",
    value: "none"
  },
  { 
    id: "tap", 
    label: "reader.readerSettings.scrollAffordances.toggleOnMiddlePointer.tap",
    value: "tap"
  },
  { 
    id: "click", 
    label: "reader.readerSettings.scrollAffordances.toggleOnMiddlePointer.click",
    value: "click"
  }
];

export const PlaygroundScrollToggleOnMiddlePointerSetting = ({ standalone }: StatefulDropdownProps) => {
  const { t } = useI18n("playground");
  const { preferences } = usePreferences();

  const scroll = useAppSelector(state => state.settings.scroll);
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const isScroll = scroll && !isFXL;

  const scrollAffordances = useAppSelector(state => state.preferences.scrollAffordances);
  const dispatch = useAppDispatch();

  const toggleOnMiddlePointer = useMemo(() => 
    scrollAffordances?.toggleOnMiddlePointer ?? 
    preferences?.affordances?.scroll?.toggleOnMiddlePointer ?? [],
    [scrollAffordances, preferences?.affordances?.scroll?.toggleOnMiddlePointer]
  );

  const selectedValue = useMemo(() => {
    if (!toggleOnMiddlePointer || toggleOnMiddlePointer.length === 0) {
      return "none";
    }
    return toggleOnMiddlePointer[0];
  }, [toggleOnMiddlePointer]);

  const handleChange = useCallback((key: React.Key | null) => {
    if (!key) return;
    
    const keyString = key.toString();
    const newValue = keyString === "none" ? [] : [keyString as "tap" | "click"];
    
    dispatch(setScrollAffordances({ 
      ...scrollAffordances,
      toggleOnMiddlePointer: newValue
    }));
  }, [dispatch, scrollAffordances]);

  return (
    <StatefulDropdown
      standalone={ standalone }
      label={ t("reader.readerSettings.scrollAffordances.toggleOnMiddlePointer.title") }
      isDisabled={ !isScroll }
      selectedKey={ selectedValue }
      onSelectionChange={ handleChange }
      items={ options.map(option => ({
        id: option.id,
        label: t(option.label),
        value: option.value
      }))}
    />
  );
};
