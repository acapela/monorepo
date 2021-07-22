import styled from "styled-components";
import { CircleCloseIconButton } from "~ui/buttons/CircleCloseIconButton";
import { getObjectKey } from "~shared/object";
import { Button } from "~ui/buttons/Button";
import { RoomFilter } from "./filter";

interface Props {
  filters: RoomFilter[];
  onFilterRemoveRequest: (filter: RoomFilter) => void;
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

const UIHolder = styled.div`
  display: flex;
  column-gap: 8px;

  ${CircleIconButton} {
    margin-left: 8px;
  }
`;
