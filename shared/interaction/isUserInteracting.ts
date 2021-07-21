import { debounce } from "lodash";
import { createDocumentEvent, createWindowEvent } from "~shared/domEvents";

/**
 * This module allow checking if user just performed any interaction
 */

let didUserJustInteract = false;

export function getDidUserJustInteract() {
  return didUserJustInteract;
}

/**
 * Time needed since last interaction to mark as not interacting
 */
const IDLE_TIMEOUT = 250;

/**
 * List of document and window events that are assumed user interaction
 */
const documentInteractionEvents: Array<keyof DocumentEventMap> = ["click", "keypress", "scroll", "keydown", "keyup"];
const windowInteractionEvents: Array<keyof WindowEventMap> = ["resize", "scroll"];

// Will mark as interacting and add delayed marking as not interacting
function markInteraction() {
  didUserJustInteract = true;
  markAsNotInteractingWithDelay();
}

const markAsNotInteractingWithDelay = debounce(() => {
  didUserJustInteract = false;
}, IDLE_TIMEOUT);

documentInteractionEvents.forEach((eventName) => {
  createDocumentEvent(eventName, markInteraction, { capture: true });
});

windowInteractionEvents.forEach((eventName) => {
  createWindowEvent(eventName, markInteraction, { capture: true });
});
