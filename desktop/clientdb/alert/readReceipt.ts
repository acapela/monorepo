import gql from "graphql-tag";

import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { userIdContext } from "@aca/clientdb/utils/context";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { AlertReadReceiptFragment, Alert_Read_Receipt_Bool_Exp, Alert_Read_Receipt_Insert_Input } from "@aca/gql";
import { EntityByDefinition, defineEntity } from "@acapela/clientdb";

const alertReadReceiptFragment = gql`
  fragment AlertReadReceipt on alert_read_receipt {
    id
    user_id
    read_at
    alert_id
    updated_at
  }
`;

type AlertReadReceiptConstraints = {
  key: "alert_read_receipt_pkey";
  update: null;
  insert: Alert_Read_Receipt_Insert_Input;
  where: Alert_Read_Receipt_Bool_Exp;
};

export const alertReadReceiptEntity = defineEntity<AlertReadReceiptFragment>({
  name: "alert_read_receipt",
  updatedAtField: "updated_at",
  idField: "id",
  keys: getFragmentKeys<AlertReadReceiptFragment>(alertReadReceiptFragment),
  getDefaultValues: ({ getContextValue }) => ({
    __typename: "alert_read_receipt",
    user_id: getContextValue(userIdContext) as string,
    read_at: new Date().toISOString(),
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<AlertReadReceiptFragment, AlertReadReceiptConstraints>(
    alertReadReceiptFragment,
    {
      insertColumns: ["user_id", "alert_id"],
      updateColumns: [],
      upsertConstraint: "alert_read_receipt_pkey",
    }
  ),
});

export type AlertEntity = EntityByDefinition<typeof alertReadReceiptEntity>;
