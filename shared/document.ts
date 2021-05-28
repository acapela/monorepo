const documentReadyPromise = new Promise<void>((resolve) => {
  if (typeof document === "undefined") return;

  if (document.readyState !== "loading") {
    resolve();
    return;
  }

  document.addEventListener(
    "DOMContentLoaded",
    () => {
      resolve();
    },
    { once: true }
  );
});

export async function onDocumentReady(callback: () => void) {
  if (typeof document === "undefined") return;

  await documentReadyPromise;
  callback();
}
