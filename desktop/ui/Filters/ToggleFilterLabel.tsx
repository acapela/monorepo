import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { NotificationFilter } from "@aca/desktop/clientdb/list";
import { IntegrationClient } from "@aca/desktop/domains/integrations/types";

import { FilterLabel } from "./FilterLabel";

interface Props {
  client: IntegrationClient;
  onChange: (newValue: NotificationFilter) => void;
  onRemoveRequest: (filter: NotificationFilter) => void;
  filter: NotificationFilter | null;
}

export const ToggleFilterLabel = observer(({ client, onChange, onRemoveRequest, filter }: Props) => {
  function toggle() {
    if (filter) {
      onRemoveRequest(filter);
    } else {
      onChange({ __typename: client.notificationTypename });
    }
  }

  return (
    <UIHolder>
      <FilterLabel
        label={client.name}
        icon={client.icon}
        isFilled={!!filter}
        onClick={toggle}
        onClearRequest={toggle}
      />
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
