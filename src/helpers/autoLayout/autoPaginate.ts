export const autoPaginate = (breakpoint: number, width: number, lineLength: number): number => {
  const defaultFontSize = 16;
  breakpoint = breakpoint / defaultFontSize;
  width = width / defaultFontSize;
  return (width >= breakpoint && width >= lineLength) ? Math.floor(width / lineLength) : 1;
}