import { initializeNotificationBridge } from "../apps/bridge";
import { initializeFooBridge } from "./foo";
import { initializePersistance } from "./persistance";

export function initializeBridgeHandlers() {
  initializePersistance();
  initializeFooBridge();
  initializeNotificationBridge();
}
