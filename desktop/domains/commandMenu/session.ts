import { ActionData } from "@aca/desktop/actions/action";
import { ActionContext } from "@aca/desktop/actions/action/context";

interface CommandMenuGetActionsInput {
  keyword: string;
}

export interface CommandMenuSession {
  actionContext: ActionContext;
  getActions(input: CommandMenuGetActionsInput): ActionData[];
}
