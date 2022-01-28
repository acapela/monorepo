import { createActionTargetPredicates } from "./targets";

export function createActionContext(forcedTarget?: unknown) {
  // TODO: handle forced target as array
  const targetPredicates = createActionTargetPredicates(() => [forcedTarget]);

  return {
    // Not really used, but makes it easier to debug actions
    forcedTarget,
    ...targetPredicates,
  };
}

export type ActionContext = ReturnType<typeof createActionContext>;
