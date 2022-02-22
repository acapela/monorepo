import { maxBy, sortBy } from "lodash";
import { RefObject, useEffect } from "react";
import styled from "styled-components";

import { createShortcutListener } from "@aca/ui/keyboard/shortcutBase";

import { unshiftElement } from "../array";
import { createDocumentEvent } from "../domEvents";
import { useMethod } from "./useMethod";

export const CANCEL_CLICK_OUTSIDE_CLASSNAME = "cancel-click-outside";

type ClickOutsideHandler = () => void;

type ClickOutsideStackItem = {
  element: HTMLElement;
  handler: ClickOutsideHandler;
};

const clickOutsideHandlers: Array<ClickOutsideStackItem> = [];

function handlePossibleClickOutside(event: MouseEvent | TouchEvent) {
  const clickedElement = event.target as HTMLElement;

  const handlersByPriority = sortBy(clickOutsideHandlers, (handler) => {
    return areElementsInTheSameRoot(handler.element, clickedElement) ? 0 : 1;
  });
  for (const { element, handler } of handlersByPriority) {
    if (!element || !clickedElement) continue;

    if (element === clickedElement) continue;

    if (element.contains(clickedElement)) continue;

    if (clickedElement.matches(`.${CANCEL_CLICK_OUTSIDE_CLASSNAME}, .${CANCEL_CLICK_OUTSIDE_CLASSNAME} *`)) {
      continue;
    }

    event.stopPropagation();
    event.preventDefault();

    handler();
    return;
  }
}

createDocumentEvent("mousedown", handlePossibleClickOutside);
createDocumentEvent("touchstart", handlePossibleClickOutside);

createShortcutListener(["Escape"], {
  callback() {
    const roots = clickOutsideHandlers.map((handler) => getElementRoot(handler.element));
    const lastRoot = getLastRoot(roots);

    if (!lastRoot) return;

    const handlerToClose = clickOutsideHandlers.find((handler) => getElementRoot(handler.element) === lastRoot);

    if (!handlerToClose) {
      return;
    }

    handlerToClose.handler();
  },
});

export function useHandleCloseRequest(ref: RefObject<HTMLElement | null>, callback: () => void) {
  const callbackRef = useMethod(callback);

  useEffect(() => {
    if (!ref.current) return;

    return unshiftElement(clickOutsideHandlers, { element: ref.current, handler: callbackRef });
  }, [ref, ref.current]);
}

export const CancelClickOutside = styled.div.attrs(() => ({ className: CANCEL_CLICK_OUTSIDE_CLASSNAME }))``;

function getElementRoot(element: HTMLElement) {
  const body = element.ownerDocument.body;

  let parent = element.parentElement;

  if (parent === body) {
    return element;
  }

  while (parent !== body) {
    if (parent?.parentElement === body) {
      return parent;
    }
    parent = parent?.parentElement ?? null;
  }

  throw new Error("No body?");
}

function areElementsInTheSameRoot(a: HTMLElement, b: HTMLElement) {
  return getElementRoot(a) === getElementRoot(b);
}

function getLastRoot(elements: HTMLElement[]) {
  const roots = elements.filter((element) => element.parentElement === element.ownerDocument.body);

  return maxBy(roots, (element) => getChildIndex(element));
}

function getChildIndex(node: HTMLElement) {
  return Array.prototype.indexOf.call(node.parentNode?.childNodes, node);
}
