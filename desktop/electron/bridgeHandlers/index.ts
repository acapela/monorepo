import { initializeCleanupsHandler } from "@aca/desktop/bridge/base/invokeWithCleanup";
import { initializeAuthHandlers } from "@aca/desktop/electron/auth";

import { initializeContextMenuHandlers } from "./contextMenu";
import { initializeDialogsHandlers } from "./dialogs";
import { initializePersistance } from "./persistance";
import { initPreviewHandler } from "./previews";
import { initializeSystemHandlers } from "./system";
import { initializeSystemMenuHandlers } from "./systemMenu";
import { initializeTrayHandlers } from "./tray";

export function initializeBridgeHandlers() {
  initializePersistance();
  initPreviewHandler();
  initializeSystemHandlers();
  initializeAuthHandlers();
  initializeCleanupsHandler();
  initializeContextMenuHandlers();
  initializeSystemMenuHandlers();
  initializeDialogsHandlers();
  initializeTrayHandlers();
}
