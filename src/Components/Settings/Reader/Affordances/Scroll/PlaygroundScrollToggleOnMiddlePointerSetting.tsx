"use client";

import { useCallback, useMemo } from "react";

import { 
  StatefulSwitch,
  StatefulSwitchProps,
  useI18n,
  usePreferences,
  useAppDispatch,
  useAppSelector,
  setScrollAffordances
} from "@edrlab/thorium-web/epub";

export const PlaygroundScrollToggleOnMiddlePointerSetting = ({ standalone }: StatefulSwitchProps) => {
  const { t } = useI18n("playground");
  const { preferences } = usePreferences();

  const scroll = useAppSelector(state => state.settings.scroll);
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const isScroll = scroll && !isFXL;

  const scrollAffordances = useAppSelector(state => state.preferences.scrollAffordances);
  const dispatch = useAppDispatch();

  const toggleOnMiddlePointer = useMemo((): string | string[] => 
    scrollAffordances?.toggleOnMiddlePointer ?? 
    preferences?.affordances?.scroll?.toggleOnMiddlePointer ?? 
    "none",
    [scrollAffordances, preferences?.affordances?.scroll?.toggleOnMiddlePointer]
  );

  const isEnabled = useMemo(() => 
    toggleOnMiddlePointer !== "none" && toggleOnMiddlePointer.length > 0, 
    [toggleOnMiddlePointer]
  );

  const handleChange = useCallback((isSelected: boolean) => {
    const newValue = isSelected ? ["tap", "click"] : "none";
    
    dispatch(setScrollAffordances({ 
      ...scrollAffordances,
      toggleOnMiddlePointer: newValue
    }));
  }, [dispatch, scrollAffordances]);

  return (
    <StatefulSwitch
      label={ t("reader.readerSettings.scrollAffordances.toggleOnMiddlePointer") }
      standalone={ standalone }
      isSelected={ isEnabled }
      isDisabled={ !isScroll }
      onChange={ handleChange }
    />
  );
};
