import { initializeLoginHandler } from "@aca/desktop/electron/auth/acapela";

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
  initializeLoginHandler();
}
