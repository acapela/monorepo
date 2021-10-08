import { wait } from "./time";

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

async function waitForImageToLoadOrFail(image: HTMLImageElement) {
  if (image.complete) {
    return;
  }

  return new Promise<void>((resolve) => {
    image.addEventListener("load", () => resolve());
    image.addEventListener("error", () => resolve());
  });
}

async function waitForCurrentImagesToLoad() {
  await documentReadyPromise;

  const imageLoadedOrErrorPromises = Array.from(document.images).map(waitForImageToLoadOrFail);

  await Promise.all(imageLoadedOrErrorPromises);
}

// eslint-disable-next-line no-async-promise-executor
const allImagesLoadedPromise = new Promise<void>((resolve) => {
  waitForCurrentImagesToLoad().then(() => resolve());
});

/**
 * Window onload is called pretty quickly, but we actually almost always have some additional resources to be loaded.
 *
 * Let's wait a bit so we'll have chance to detect more images in DOM that are still loading to return more precise result.
 */
const MIN_ASSUMED_WINDOW_LOADING_TIME = 500;

async function waitForWindowToLoad() {
  if (typeof document === "undefined") return;

  await documentReadyPromise;
  await wait(MIN_ASSUMED_WINDOW_LOADING_TIME);
  await allImagesLoadedPromise;
}

const windowLoadedPromise = new Promise<void>((resolve) => {
  waitForWindowToLoad().then(resolve);
});

export async function onWindowLoaded(callback: () => void) {
  if (typeof document === "undefined") return;

  await windowLoadedPromise;
  callback();
}

export const isServer = typeof document === "undefined";
export const isClient = typeof document !== "undefined";
