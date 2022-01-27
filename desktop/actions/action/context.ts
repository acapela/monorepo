import { createActionTargetPredicates } from "./targets";

export function createActionContext(forcedTarget?: unknown) {
  // TODO: handle forced target as array
  const targetPredicates = createActionTargetPredicates(() => [forcedTarget]);

  return {
    ...targetPredicates,
  };
}

export type ActionContext = ReturnType<typeof createActionContext>;
