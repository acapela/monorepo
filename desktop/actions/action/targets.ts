import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { getIsConfiguredList } from "@aca/desktop/domains/lists";

import { createPredicates } from "./predicates";

/**
 * All types of targets that action context is able to recognize are here
 *
 * Important note! Each function provided here must accept one argument and return predicate type
 * that tells of what type provided input is
 *
 * BAD: foo: (item: unknown) => boolean
 * GOOD: foo: (item: unknown) => item is Notification
 */
export const targetPredicates = {
  notification(input: unknown): input is NotificationEntity {
    return (input as NotificationEntity)?.__typename === "notification";
  },
  list: getIsConfiguredList,
};

export function createActionTargetPredicates(targets: () => unknown[]) {
  return createPredicates(targetPredicates, targets);
}
