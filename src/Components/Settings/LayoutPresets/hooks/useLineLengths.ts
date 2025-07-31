import { useEffect, useCallback } from "react";

import { layoutPresets, layoutPresetsValues } from "@/preferences/enums";

import { 
  useEpubNavigator, 
  useAppDispatch, 
  useAppSelector, 
  setLineLength,
  usePreferences
} from "@edrlab/thorium-web/epub";

import { setLayoutPreset } from "@/lib/customReducer";

export const useLineLengths = () => {
  const dispatch = useAppDispatch();
  const { submitPreferences, getSetting } = useEpubNavigator();
  const RSPrefs = usePreferences();
  const layoutPreset = useAppSelector(state => state.custom.layoutPreset);
  const lineLength = useAppSelector(state => state.settings.lineLength);
  
  // On mount and when layoutPreset changes, sync line lengths
  useEffect(() => {
    // If not custom, submit the preset values
    if (layoutPreset !== "custom") {
      const preset = layoutPresetsValues[layoutPreset as keyof typeof layoutPresetsValues];
      submitPreferences({
        minimalLineLength: preset.min,
        optimalLineLength: preset.optimal,
        maximalLineLength: preset.max
      });
    
    // Always sync Redux with current preferences
    const minimal = getSetting("minimalLineLength");
    const optimal = getSetting("optimalLineLength");
    const maximal = getSetting("maximalLineLength");
    
      dispatch(setLineLength({
        key: "min",
        value: minimal ?? RSPrefs.typography.minimalLineLength,
        isDisabled: minimal === null
      }));
    
      dispatch(setLineLength({
        key: "optimal",
        value: optimal ?? RSPrefs.typography.optimalLineLength,
        isDisabled: false
      }));
    
      dispatch(setLineLength({
        key: "max",
        value: maximal ?? RSPrefs.typography.maximalLineLength,
        isDisabled: maximal === null
      }));
    }
  }, [layoutPreset, dispatch, submitPreferences, getSetting, RSPrefs.typography]);

  // Helper function to get the correct preference key
  const getPreferenceKey = (type: "min" | "optimal" | "max") => {
    switch (type) {
      case "min": return "minimalLineLength";
      case "optimal": return "optimalLineLength";
      case "max": return "maximalLineLength";
    }
  };

  // Update preset (used by PlaygroundLayoutPresets)
  const updatePreset = useCallback(async (value: layoutPresets) => {
    dispatch(setLayoutPreset(value));
    
    // If the preset is not "custom", update the preferences with the preset values
    if (value !== "custom") {
      const preset = layoutPresetsValues[value];
      await submitPreferences({
        minimalLineLength: preset.min,
        optimalLineLength: preset.optimal,
        maximalLineLength: preset.max
      });
    }
  }, [dispatch, submitPreferences]);

  // Update line length (used by PlaygroundLineLengths)
  const updatePreference = useCallback(async (type: "min" | "optimal" | "max", value: number) => {
    // Switch to custom if needed
    if (layoutPreset !== "custom") {
      dispatch(setLayoutPreset("custom"));
    }
    
    const prefKey = getPreferenceKey(type);
    
    // Submit to preferences
    await submitPreferences({
      [prefKey]: value
    });
    
    // Update Redux
    dispatch(setLineLength({
      key: type,
      value,
      isDisabled: type !== "optimal" && value === null
    }));
  }, [layoutPreset, dispatch, submitPreferences]);

  // Toggle min/max chars (used by PlaygroundMinChars/PlaygroundMaxChars)
  const toggleLineLength = useCallback(async (type: "min" | "max", isSelected: boolean) => {
    const prefKey = getPreferenceKey(type);
    
    // Switch to custom layout when toggling min/max
    if (layoutPreset !== "custom") {
      dispatch(setLayoutPreset("custom"));
    }
    
    if (isSelected) {
      // When disabling (switch is selected means disabled in UI)
      await submitPreferences({
        [prefKey]: null
      });
      
      // Update Redux to mark as disabled
      dispatch(setLineLength({
        key: type,
        isDisabled: true
      }));
    } else {
      // When enabling (switch is not selected means enabled in UI)
      // Use the exact value from Redux store
      const currentValue = lineLength?.[type]?.chars;
      
      // Submit the value to preferences
      await submitPreferences({
        [prefKey]: currentValue
      });
      
      // Update Redux to enable
      dispatch(setLineLength({
        key: type,
        value: currentValue,
        isDisabled: false
      }));
    }
  }, [layoutPreset, dispatch, submitPreferences, lineLength]);

  return { 
    updatePreset,
    updatePreference,
    toggleLineLength
  };
};
