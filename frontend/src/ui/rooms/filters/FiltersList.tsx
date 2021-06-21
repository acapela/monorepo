import styled from "styled-components";
import { IconButton } from "~ui/buttons/IconButton";
import { IconCross } from "~ui/icons";
import { getObjectKey } from "~shared/object";
import { TransparentButton } from "~ui/buttons/TransparentButton";
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
          <TransparentButton icon={filter.icon} iconPosition="start" key={getObjectKey(filter)}>
            {filter.label}
            <IconButton icon={<IconCross />} onClick={() => onFilterRemoveRequest(filter)} />
          </TransparentButton>
        );
      })}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  column-gap: 8px;

  ${IconButton} {
    margin-left: 8px;
  }
`;
