import styled from "styled-components";

import { getObjectKey } from "~shared/object";
import { Button } from "~ui/buttons/Button";
import { CircleCloseIconButton } from "~ui/buttons/CircleCloseIconButton";

import { RoomCriteria } from "./filter";

interface Props {
  filters: RoomCriteria[];
  onFilterRemoveRequest: (filter: RoomCriteria) => void;
}

export function FiltersList({ filters, onFilterRemoveRequest }: Props) {
  return (
    <UIHolder>
      {filters.map((filter) => {
        return (
          <Button kind="transparent" icon={filter.icon} iconPosition="start" key={getObjectKey(filter)}>
            {filter.label}
            <CircleCloseIconButton onClick={() => onFilterRemoveRequest(filter)} />
          </Button>
        );
      })}
    </UIHolder>
  );
}

const UIHolder = styled.div<{}>`
  display: flex;
  column-gap: 8px;

  ${CircleCloseIconButton} {
    margin-left: 8px;
  }
`;
