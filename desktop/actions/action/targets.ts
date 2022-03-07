import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { getIsIntegrationClient } from "@aca/desktop/domains/integrations";
import { Workspace } from "@aca/desktop/domains/integrations/types";
import { getIsNotificationsList } from "@aca/desktop/domains/list/defineList";

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
  list: getIsNotificationsList,
  group: getIsNotificationsGroup,
  integration: getIsIntegrationClient,
  workspace: (input: unknown): input is Workspace => (input as Workspace)?.kind == "workspace",
};

export function createActionTargetPredicates(targets: () => unknown[]) {
  return createPredicates(targetPredicates, targets);
}
