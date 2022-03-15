import { initializeCleanupsHandler } from "@aca/desktop/bridge/base/invokeWithCleanup";
import { initializeAuthHandlers } from "@aca/desktop/electron/auth";

import { initializeContextMenuHandlers } from "./contextMenu";
import { initializePersistance } from "./persistance";
import { initPreviewHandler } from "./previews";
import { initializeSystemHandlers } from "./system";
import { initializeSystemMenuHandlers } from "./systemMenu";

export function initializeBridgeHandlers() {
  initializePersistance();
  initPreviewHandler();
  initializeSystemHandlers();
  initializeAuthHandlers();
  initializeCleanupsHandler();
  initializeContextMenuHandlers();
  initializeSystemMenuHandlers();
}
