export function onDocumentReady(callback: () => void) {
  if (typeof document === "undefined") return;

  if (document.readyState !== "loading") {
    callback();
    return;
  }

  document.addEventListener("DOMContentLoaded", () => {
    callback();
  });
}
