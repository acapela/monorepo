import { getIsConfiguredList } from "@aca/desktop/domains/lists";
import { Notification } from "@aca/gql";

import { createPredicates } from "./predicates";

/**
 * All types of targets that action context is able to recognize are here
 */
export const targetPredicates = {
  notification(input: unknown): input is Notification {
    return (input as Notification)?.__typename === "notification";
  },
  list: getIsConfiguredList,
};

export function createActionTargetPredicates(targets: () => unknown[]) {
  return createPredicates(targetPredicates, targets);
}
