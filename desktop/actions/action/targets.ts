import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { getIsIntegrationClient } from "@aca/desktop/domains/integrations";
import { IntegrationAccount } from "@aca/desktop/domains/integrations/types";
import { getIsNotificationsList } from "@aca/desktop/domains/list/defineList";

import { createPredicates } from "./predicates";

export const getIsNotification = (input: unknown): input is NotificationEntity =>
  (input as NotificationEntity)?.__typename === "notification";

const getIsAccount = (input: unknown): input is IntegrationAccount => (input as IntegrationAccount)?.kind == "account";

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
  notification: getIsNotification,
  list: getIsNotificationsList,
  group: getIsNotificationsGroup,
  integration: getIsIntegrationClient,
  account: getIsAccount,
};

export function createActionTargetPredicates(forcedTargets: () => unknown[]) {
  return createPredicates(targetPredicates, forcedTargets);
}
