import produce, { Draft } from "immer";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { getDb } from "@aca/desktop/clientdb";
import { NotificationListEntity } from "@aca/desktop/clientdb/notification/list";
import { integrationClients } from "@aca/desktop/domains/integrations";
import { isNotNullish } from "@aca/shared/nullish";
import { theme } from "@aca/ui/theme";

import { FigmaFilterForm } from "./FigmaFilterForm";
import { IntegrationFilterFormProps, ProduceFiltersUpdate } from "./shared";
import { SlackFilterForm } from "./SlackFilterForm";

type IntegrationKey = keyof typeof integrationClients;

// This should not be Partial anymore once we are supporting all integrations
const IntegrationForms: Partial<Record<IntegrationKey, React.FunctionComponent<IntegrationFilterFormProps>>> = {
  figma: FigmaFilterForm,
  // linear: null,
  // notion: null,
  slack: SlackFilterForm,
};

export const NotificationFilterForm = observer(({ listId }: { listId: string }) => {
  const list = getDb().notificationList.assertFindById(listId);

  const produceFiltersUpdate: ProduceFiltersUpdate = (
    fn: (filters: Draft<NotificationListEntity["filters"]>) => void
  ) => {
    list.update({
      filters: produce(toJS(list.typedFilters), fn).filter(isNotNullish),
    });
  };

  return (
    <UIHolder>
      {Object.entries(integrationClients)
        .filter(([, integration]) => integration.getIsConnected())
        .map(([key, integration]) => {
          const IntegrationForm = IntegrationForms[key as IntegrationKey];
          if (!IntegrationForm) {
            return null;
          }
          return (
            <div key={key}>
              <UIIntegrationTitle>
                <UIIntegrationIcon>{integration.icon}</UIIntegrationIcon>
                {integration.name}
              </UIIntegrationTitle>
              <IntegrationForm filters={list.typedFilters} produceFiltersUpdate={produceFiltersUpdate} />
            </div>
          );
        })}
    </UIHolder>
  );
});

const UIHolder = styled.div`
  border-right: 1px solid ${theme.colors.layout.divider.value};
  padding: 8px;
  max-width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const UIIntegrationTitle = styled.h3`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  ${theme.typo.item.title};
`;

const UIIntegrationIcon = styled.div`
  font-size: 30px;
`;
