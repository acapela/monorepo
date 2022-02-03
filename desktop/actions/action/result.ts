import { ActionContext } from "./context";
import { ActionData } from ".";

type ChildActionsResult = {
  searchPlaceholder?: string;
  getActions: (context: ActionContext) => ActionData[];
};

export type ActionResult = ChildActionsResult;
