import { ContextMenuItem } from "../domains/contextMenu/types";
import { createInvokeBridge } from "./base/invoke";

export const showContextMenuRequest = createInvokeBridge<ContextMenuItem[], ContextMenuItem | null>(
  "show-context-menu"
);
