import { WebContents } from "electron";

import { runEffectInWebContents } from "@aca/desktop/electron/utils/webContentsLink";
import { createCleanupObject } from "@aca/shared/cleanup";
import { MaybeCleanup } from "@aca/shared/types";

export function onElementAdded(
  webContents: WebContents,
  callback: () => void,
  targetElementSelector: string
): MaybeCleanup {
  return onElementMutated(webContents, callback, { targetElementSelector, isTargetRemoval: false });
}

export function onElementRemoved(
  webContents: WebContents,
  callback: () => void,
  targetElementSelector: string
): MaybeCleanup {
  return onElementMutated(webContents, callback, { targetElementSelector, isTargetRemoval: true });
}

/*
  onElementMutated looks for added or removed elements of the webContents
  and triggers a `callback` when `targetElementSelector` is found.

  This makes heavy use of MutationObserver.
  
  How it works:
  We start observing the <body> tag of the document and look for all added/remove nested elements
  When the css selector matches the element, we'll trigger a callback and cleanup the observer.
*/

interface ObserverInputProps {
  targetElementSelector: string;
  isTargetRemoval: boolean;
}

export function onElementMutated(
  webContents: WebContents,
  callback: () => void,
  { targetElementSelector, isTargetRemoval }: ObserverInputProps
): MaybeCleanup {
  return runEffectInWebContents<void, ObserverInputProps>(
    webContents,
    (onTargetFound, input) => {
      // Needs to be defined within this scope. Don't make the silly mistake I made of moving it out
      const ELEMENT_NODE_TYPE = 1;

      // TODO: TS is misbehaving for me here
      if (!input) {
        throw new Error("input never passed in");
      }

      const isTargetAlreadyLoaded = document.querySelector(input.targetElementSelector);
      if (isTargetAlreadyLoaded && !input.isTargetRemoval) {
        onTargetFound();
        return;
      }

      // The option for childList and subtree as true allow us to observe changes nested down the dom tree
      const observerOptions = {
        childList: true,
        attributes: false, // we're only care about nodes includes/excluded from dom tree
        subtree: true,
      };

      const mo = new MutationObserver(function callback(mutations) {
        for (const mutation of mutations) {
          if (mutation.type !== "childList") {
            continue;
          }

          const nodes = input!.isTargetRemoval ? mutation.removedNodes : mutation.addedNodes;
          for (const mutatedNode of nodes) {
            if (mutatedNode.nodeType === ELEMENT_NODE_TYPE) {
              const element: Element = mutatedNode as Element;
              if (element.matches(input.targetElementSelector)) {
                onTargetFound();
                mo.disconnect();
                return;
              }
            }
          }
        }
      });

      let hasBaseElementLoaded = false;

      // In most cases we won't need to poll as "body" element is usually included when window.onload
      // However, this is an extra step to make sure that things don't break
      const clear = setInterval(() => {
        if (!hasBaseElementLoaded) {
          const baseTarget = document.querySelector("body");
          if (!baseTarget) {
            return;
          }
          hasBaseElementLoaded = true;
          mo.observe(baseTarget, observerOptions);
        }
        clearInterval(clear);
      }, 50);

      return () => {
        mo.disconnect();
      };
    },
    callback,
    { targetElementSelector, isTargetRemoval }
  );
}

/*
  In some cases, elements are left in the dom tree and just hidden with a 
  <div style="display: none;" /> // <--- this is the case for Linear

  In these cases we'll first check if the element is added (or exist) and then
  listen into attribute changes
*/
export function onElementHidden(
  webContents: WebContents,
  callback: () => void,
  targetElementSelector: string
): MaybeCleanup {
  const cleanup = createCleanupObject();

  cleanup.next = onElementAdded(
    webContents,
    () => {
      cleanup.next = runEffectInWebContents<void, string>(
        webContents,
        (onTargetFound, elementSelector) => {
          if (!elementSelector) {
            return;
          }

          const el = document.querySelector(elementSelector) as HTMLElement | null;
          if (!el) {
            throw new Error("Target never loaded or was removed");
          }

          if (el.style.display === "none") {
            onTargetFound();
            return;
          }

          const mo = new MutationObserver(function (mutations) {
            for (const mutation of mutations) {
              if (mutation.attributeName !== "style") {
                continue;
              }
              const mutatedElement = mutation.target as HTMLElement;

              if (mutatedElement.style.display === "none") {
                onTargetFound();
                mo.disconnect();
                return;
              }
            }
          });

          mo.observe(el, { attributes: true });

          return () => {
            mo.disconnect();
          };
        },
        callback,
        targetElementSelector
      );
    },
    targetElementSelector
  );

  return () => {
    cleanup.clean();
  };
}
