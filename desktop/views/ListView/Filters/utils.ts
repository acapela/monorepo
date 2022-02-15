import { NotificationFilter } from "@aca/desktop/clientdb/list";
import { integrationClientList } from "@aca/desktop/domains/integrations";

export function getFilterIntegration(filter: NotificationFilter) {
  const targetIntegration = integrationClientList.find(
    (integration) => integration.notificationTypename === filter.__typename
  );

  return targetIntegration ?? null;
}
