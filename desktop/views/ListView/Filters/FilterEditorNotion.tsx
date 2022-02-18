import { uniqBy } from "lodash";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { getDb } from "@aca/desktop/clientdb";
import { isNotNullish } from "@aca/shared/nullish";

import { ServiceUsersFilterRow } from "./ServiceUsersFilterRow";
import { NotificationFilterKind } from "./types";

type NotionFilter = NotificationFilterKind<"notification_notion">;

interface Props {
  filter: NotionFilter;
  onChange: (filter: NotionFilter) => void;
}

export const FilterEditorNotion = observer(({ filter, onChange }: Props) => {
  const notionUsers = uniqBy(getDb().notificationNotion.all, (n) => n.author_id)
    .map((n) => {
      const from = n.notification?.from;
      return n.author_id && from
        ? {
            id: n.author_id,
            display_name: from,
            real_name: from,
          }
        : null;
    })
    .filter(isNotNullish);
  return (
    <UIHolder>
      <ServiceUsersFilterRow<NotionFilter> users={notionUsers} filter={filter} field="author_id" onChange={onChange} />
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
