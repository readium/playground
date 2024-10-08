export const isInteractiveElement = (element: Element | null) => {
  const iElements = ["A", "AREA", "BUTTON", "DETAILS", "INPUT", "SELECT", "TEXTAREA"];

  if (element && (element instanceof HTMLElement || element instanceof SVGElement)) {
    if (element.closest("[inert]")) return false;
    if (element.hasAttribute("disabled")) return false;
    if (element.tabIndex) return element.tabIndex >= 0;
    if (iElements.includes(element.tagName)) return true;
  }

  return false;
}