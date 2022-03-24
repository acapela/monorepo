import React from "react";
import styled from "styled-components";

import { NotificationFilter } from "@aca/desktop/clientdb/list";
import { addToast } from "@aca/desktop/domains/toasts/store";
import { styledObserver } from "@aca/shared/component";

import { FilterLabel } from "./FilterLabel";
import { NewFilterCreator } from "./NewFilterCreator";
import { filtersEditStore } from "./store";

interface Props {
  value: NotificationFilter[];
  onChange: (filters: NotificationFilter[]) => void;
  className?: string;
}

export const ListFilters = styledObserver(({ value, onChange, className }: Props) => (
  <UIHolder className={className}>
    <UIFilters>
      <NewFilterCreator
        onCreateRequest={(filter) => {
          onChange([...value, filter]);
          filtersEditStore.editedFilter = filter;
        }}
      />
      {value.map((filter, index) => {
        return (
          <FilterLabel
            key={(filter.id as string) ?? index}
            filter={filter}
            onChange={(changedFilter) => {
              const newFilters = value.map((existingFilter) => {
                if (existingFilter.id !== changedFilter.id) {
                  return existingFilter;
                }

                return changedFilter;
              });

              onChange(newFilters);
            }}
            onRemoveRequest={(filterToRemove) => {
              onChange(value.filter((existingFilter) => existingFilter.id !== filterToRemove.id));

              addToast({
                message: "Filter removed",
                action: {
                  label: "Undo",
                  callback() {
                    onChange(value);
                  },
                },
              });
            }}
          />
        );
      })}
    </UIFilters>
  </UIHolder>
))``;

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
