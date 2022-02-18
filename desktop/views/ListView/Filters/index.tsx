import React from "react";
import styled from "styled-components";

import { getDb } from "@aca/desktop/clientdb";
import { styledObserver } from "@aca/shared/component";

import { FilterLabel } from "./FilterLabel";
import { NewFilterCreator } from "./NewFilterCreator";

interface Props {
  listId: string;
  className?: string;
}

export const ListFilters = styledObserver(function ListFilters({ listId, className }: Props) {
  const list = getDb().notificationList.assertFindById(listId);
  return (
    <UIHolder className={className}>
      <UIFilters>
        <NewFilterCreator
          onCreateRequest={(filter) => {
            list.update({ filters: [...list.filters, filter] });
            //
          }}
        />
        {list.typedFilters.map((filter, index) => {
          return (
            <FilterLabel
              key={(filter.id as string) ?? index}
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
