import { initializeAuthHandlers } from "@aca/desktop/electron/auth";

import { initPreviewHandler } from "./browserView";
import { initializePersistance } from "./persistance";
import { initializeSystemHandlers } from "./system";

export function initializeBridgeHandlers() {
  initializePersistance();
  initPreviewHandler();
  initializeSystemHandlers();
  initializeAuthHandlers();
}
