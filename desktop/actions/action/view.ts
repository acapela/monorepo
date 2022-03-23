import { cachedComputed } from "@aca/clientdb";

import { ActionContext } from "./context";

export interface ActionView<D> {
  getView(context: ActionContext): D;
}

export function createActionView<D>(getter: (context: ActionContext) => D): ActionView<D> {
  // Let's cache view for single context, as it might be requested tons of times
  const getView = cachedComputed(function getView(context: ActionContext) {
    return getter(context);
  });

  return {
    getView,
  };
}
