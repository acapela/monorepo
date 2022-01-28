import { navigateToList } from "@aca/desktop/domains/lists";

import { defineAction } from "./action";

export const exitFocusMode = defineAction({
  // TODO: when we have CMD + K - this can return `Open list...` and result in sub-actions select being opened if no target is set
  name: (context) => `${context.assertTarget("list").name}`,
  canApply: (context) => context.hasTargets("list"),
  handler(context) {
    navigateToList(context.assertTarget("list").id);
  },
});

export const goToNextNotification = defineAction({
  // TODO: when we have CMD + K - this can return `Open list...` and result in sub-actions select being opened if no target is set
  name: (context) => `${context.assertTarget("list").name}`,
  canApply: (context) => context.hasTargets("list"),
  handler(context) {
    navigateToList(context.assertTarget("list").id);
  },
});

export const goToPreviousNotification = defineAction({
  // TODO: when we have CMD + K - this can return `Open list...` and result in sub-actions select being opened if no target is set
  name: (context) => `${context.assertTarget("list").name}`,
  canApply: (context) => context.hasTargets("list"),
  handler(context) {
    navigateToList(context.assertTarget("list").id);
  },
});
