export function getFocusedElement(): HTMLElement | null {
  if (typeof document === "undefined") return null;

  if (document.activeElement && document.activeElement !== document.body) {
    return document.activeElement as HTMLElement;
  }

  return null;
}
