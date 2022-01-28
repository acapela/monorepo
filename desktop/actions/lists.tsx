import { navigateToList } from "@aca/desktop/domains/lists";

import { defineAction } from "./action";

export const goToList = defineAction({
  // TODO: when we have CMD + K - this can return `Open list...` and result in sub-actions select being opened if no target is set
  name: (context) => `${context.assertTarget("list").name}`,
  canApply: (context) => context.hasTargets("list"),
  handler(context) {
    navigateToList(context.assertTarget("list").id);
  },
});
