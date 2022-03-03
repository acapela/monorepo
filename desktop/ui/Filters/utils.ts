import { NotificationFilter } from "@aca/desktop/clientdb/list";
import { integrationClientList } from "@aca/desktop/domains/integrations";
import { IntegrationClient } from "@aca/desktop/domains/integrations/types";
import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
import { injectProps } from "@aca/shared/components/injectProps";

export function getFilterIntegration(filter: NotificationFilter) {
  const targetIntegration = integrationClientList.find(
    (integration) => integration.notificationTypename === filter.__typename
  );

  return targetIntegration ?? null;
}

export const FILTER_EDITOR_OPTION_WIDTH = 220;

export const FilterSettingRow = injectProps(SettingRow, { fixedOptionWidth: FILTER_EDITOR_OPTION_WIDTH });

export function getWorkspaceLabel(integrationClient: IntegrationClient, id?: string) {
  const connections = integrationClient.getConnections();
  const label = id && connections.length > 1 && connections.find((c) => c.id == id)?.title;
  return label ? ` (${label})` : "";
}
