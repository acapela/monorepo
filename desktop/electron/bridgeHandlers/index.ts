import { initializeNotificationBridge } from "../services/bridge";
import { initializeFooBridge } from "./foo";

export function initializeBridgeHandlers() {
  initializeFooBridge();
  initializeNotificationBridge();
}
