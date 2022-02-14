import { observer } from "mobx-react";
import styled from "styled-components";

import { FilterDescriptionLabel } from "./FilterDescriptionLabel";
import { filtersEditStore } from "./store";
import { NotificationFilter } from "./types";

interface Props {
  filter: NotificationFilter;
}

export const FilterLabel = observer(function FilterLabel({ filter }: Props) {
  const isEdited = filtersEditStore.editedFilter === filter;

  console.info({ isEdited });
  return (
    <UILabel>
      <FilterDescriptionLabel filter={filter} />
    </UILabel>
  );
});

const UILabel = styled.div``;
