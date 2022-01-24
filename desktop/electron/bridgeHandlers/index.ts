import { initializeAuthHandlers } from "@aca/desktop/electron/auth";

import { initializeNotificationBridge } from "../services/bridge";
import { initializeFooBridge } from "./foo";
import { initializePersistance } from "./persistance";
import { initPreviewHandler } from "./preview";
import { initializeSystemHandlers } from "./system";

export function initializeBridgeHandlers() {
  initializePersistance();
  initializeFooBridge();
  initializeNotificationBridge();
  initPreviewHandler();
  initializeSystemHandlers();
  initializeAuthHandlers();
}
