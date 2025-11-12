export enum layoutPresets {
  lineLength = "lineLength",
  margin = "margin",
  fullWidth = "fullWidth",
  columns = "columns",
  newspaper = "newspaper",
  custom = "custom"
}

export const layoutPresetsValues = {
  lineLength: {
    min: 40,
    optimal: 55,
    max: 70
  },
  margin: {
    min: 40,
    optimal: 55,
    max: 55 
  },
  fullWidth: {
    min: 40,
    optimal: 55,
    max: null 
  },
  columns: {
    min: null,
    optimal: 55,
    max: 70
  },
  newspaper: {
    min: 30,
    optimal: 40,
    max: 50
  }
}

export enum ScrollAffordanceKeys {
  ToggleOnMiddlePointer = "toggleOnMiddlePointer",
  ShowOnBackwardScroll = "showOnBackwardScroll",
  HideOnForwardScroll = "hideOnForwardScroll",
  HintInImmersive = "hintInImmersive"
}

export enum readerPreferencesContainerKeys {
  initial = "initial",
  runningHead = "runningHead",
  progression = "progression",
  paginatedAffordances = "paginatedAffordances",
  scrollAffordances = "scrollAffordances",
}

export enum PaginatedAffordanceKeys {
  Variant = "variant",
  Hint = "hint",
  Discard = "discard"
}