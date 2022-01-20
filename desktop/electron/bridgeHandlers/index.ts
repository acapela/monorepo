import { initializeNotificationBridge } from "../services/bridge";
import { initializeFooBridge } from "./foo";
import { initializePersistance } from "./persistance";
import { initPreviewHandler } from "./preview";

export function initializeBridgeHandlers() {
  initializePersistance();
  initializeFooBridge();
  initializeNotificationBridge();
  initPreviewHandler();
}
