import { ChildWindowCustomKind } from "@aca/desktop/domains/childWindow/kinds";

import { focusBarWindowHandler } from "./focusBar";
import { ChildWindowHandler } from "./types";

type ChildWindowKindHandlers = Record<ChildWindowCustomKind, ChildWindowHandler>;

export const childWindowKindHandlers: ChildWindowKindHandlers = {
  "focus-bar": focusBarWindowHandler,
};
