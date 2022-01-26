import { initializeAuthHandlers } from "@aca/desktop/electron/auth";

import { initializePersistance } from "./persistance";
import { initPreviewHandler } from "./preview";
import { initializeSystemHandlers } from "./system";

export function initializeBridgeHandlers() {
  initializePersistance();
  initPreviewHandler();
  initializeSystemHandlers();
  initializeAuthHandlers();
}
