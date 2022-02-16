import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { getDb } from "@aca/desktop/clientdb";

import { FilterLabel } from "./FilterLabel";
import { NewFilterCreator } from "./NewFilterCreator";

interface Props {
  listId: string;
}

export const ListFilters = observer(function ListFilters({ listId }: Props) {
  const list = getDb().notificationList.assertFindById(listId);
  return (
    <UIHolder>
      <UIFilters>
        <NewFilterCreator
          onCreateRequest={(filter) => {
            list.update({ filters: [...list.filters, filter] });
            //
          }}
        />
        {list.typedFilters.map((filter) => {
          return (
            <FilterLabel
              filter={filter}
              onChange={(changedFilter) => {
                const newFilters = list.typedFilters.map((existingFilter) => {
                  if (existingFilter.id !== changedFilter.id) {
                    return existingFilter;
                  }

                  return changedFilter;
                });

                list.update({ filters: newFilters });
              }}
              onRemoveRequest={(filterToRemove) => {
                const newFilters = list.typedFilters.filter(
                  (existingFilter) => existingFilter.id !== filterToRemove.id
                );

                list.update({ filters: newFilters });
              }}
            />
          );
        })}
      </UIFilters>
    </UIHolder>
  );
});

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
