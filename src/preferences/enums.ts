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
    optimal: 65,
    max: 75 
  },
  margin: {
    min: 40,
    optimal: 65,
    max: 65 
  },
  fullWidth: {
    min: 40,
    optimal: 65,
    max: null 
  },
  columns: {
    min: null,
    optimal: 65,
    max: 75
  },
  newspaper: {
    min: 30,
    optimal: 40,
    max: 50
  }
}