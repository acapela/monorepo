import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { userIdContext } from "@aca/clientdb/utils/context";
import { AlertFragment } from "@aca/gql";

import { alertReadReceiptEntity } from "./readReceipt";

const alertFragment = gql`
  fragment Alert on alert {
    id
    created_at
    updated_at
    user_id
    kind
    app_version_range
    link
    content_type
    title
    body
    connected_integrations
    expires_at
  }
`;

export const alertEntity = defineEntity<AlertFragment>({
  name: "alert",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<AlertFragment>(alertFragment),
  sync: createHasuraSyncSetupFromFragment<AlertFragment>(alertFragment),
}).addConnections((alertEntity, { getEntity, getContextValue }) => {
  const connections = {
    get isRead() {
      const user_id = getContextValue(userIdContext);
      if (!user_id) {
        return false;
      }
      const alert = getEntity(alertReadReceiptEntity).query({ user_id, alert_id: alertEntity.id }).first;
      return !!alert?.read_at;
    },
  };
  return connections;
});

export type AlertEntity = EntityByDefinition<typeof alertEntity>;
