import { uniqBy } from "lodash";
import React from "react";
import styled from "styled-components";

import { NotificationFilter, NotificationListEntity } from "@aca/desktop/clientdb/list";
import { integrationClientList } from "@aca/desktop/domains/integrations";
import { styledObserver } from "@aca/shared/component";
import { getObjectKey } from "@aca/shared/object";
import { getUUID } from "@aca/shared/uuid";

import { FilterEditorSlack } from "./FilterEditorSlack";
import { ToggleFilterLabel } from "./ToggleFilterLabel";
import { pickFilterByClient } from "./types";

interface Props {
  list: NotificationListEntity;
  className?: string;
}

function cleanupCurrentFilters(filters: NotificationFilter[]) {
  const validFilters = filters.filter((filter) => !!filter.id);

  const uniqueKindFilters = uniqBy(validFilters, (filter) => filter.__typename);

  return uniqueKindFilters;
}

export const ListFiltersEditor = styledObserver(({ list, className }: Props) => {
  const connectedClients = integrationClientList.filter((integration) => integration.getIsConnected());

  let currentFilters = list.typedFilters;

  function onChange(filters: NotificationFilter[]) {
    list.update({ filters });
  }

  currentFilters = cleanupCurrentFilters(currentFilters);

  function handleFilterChange(changedFilter: NotificationFilter) {
    changedFilter = { id: getUUID(), ...changedFilter };

    const isExistingFilter = currentFilters.some((filter) => filter.id === changedFilter.id);

    if (!isExistingFilter) {
      onChange([...currentFilters, changedFilter]);
      return;
    }

    const newFilters = currentFilters.map((existingFilter) => {
      if (existingFilter.id !== changedFilter.id) {
        return existingFilter;
      }

      return changedFilter;
    });

    onChange(newFilters);
  }

  function handleFilterRemove(filterToRemove: NotificationFilter) {
    onChange(currentFilters.filter((existingFilter) => existingFilter.id !== filterToRemove.id));
  }

  return (
    <UIHolder className={className}>
      <UIFilters>
        {connectedClients.map((integration) => {
          const currentFilter = pickFilterByClient(currentFilters, integration);

          const key = getObjectKey(integration);

          switch (integration.notificationTypename) {
            case "notification_slack_message":
              return (
                <FilterEditorSlack
                  key={key}
                  filter={currentFilter}
                  onChange={handleFilterChange}
                  onRemoveRequest={handleFilterRemove}
                />
              );

            default:
              return (
                <ToggleFilterLabel
                  key={key}
                  filter={currentFilter}
                  onChange={handleFilterChange}
                  onRemoveRequest={handleFilterRemove}
                  client={integration}
                />
              );
          }
        })}
      </UIFilters>
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const UIFilters = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;
