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
    min: 35,
    optimal: 60,
    max: 70
  },
  margin: {
    min: 35,
    optimal: 60,
    max: 60 
  },
  fullWidth: {
    min: 35,
    optimal: 60,
    max: null 
  },
  columns: {
    min: null,
    optimal: 60,
    max: 70
  },
  newspaper: {
    min: 30,
    optimal: 40,
    max: 50
  }
}