import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { getIsIntegrationClient } from "@aca/desktop/domains/integrations";
import { IntegrationAccount, IntegrationClient } from "@aca/desktop/domains/integrations/types";
import { getIsNotificationsList } from "@aca/desktop/domains/list/defineList";

import { createPredicates } from "./predicates";

export const getIsNotification = (input: unknown): input is NotificationEntity =>
  (input as NotificationEntity)?.__typename === "notification";

const getIsAccount = (input: unknown): input is IntegrationAccount => (input as IntegrationAccount)?.kind == "account";

type IntegrationWithAccount = { integration: IntegrationClient; account: IntegrationAccount };

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
  integrationWithAccount: (input: unknown): input is IntegrationWithAccount =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Boolean(getIsIntegrationClient((input as any).integration) && getIsAccount((input as any).account)),
};

export function createActionTargetPredicates(targets: () => unknown[]) {
  return createPredicates(targetPredicates, targets);
}
