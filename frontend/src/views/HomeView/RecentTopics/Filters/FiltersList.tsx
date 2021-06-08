import styled from "styled-components";
import { getObjectKey } from "~shared/object";
import { TransparentButton } from "~ui/buttons/TransparentButton";
import { RecentTopicsFilter } from "./filter";

interface Props {
  filters: RecentTopicsFilter[];
  onFilterRemoveRequest: (filter: RecentTopicsFilter) => void;
}

export function FiltersList({ filters, onFilterRemoveRequest }: Props) {
  return (
    <UIHolder>
      {filters.map((filter) => {
        return (
          <TransparentButton
            icon={filter.icon}
            iconPosition="start"
            key={getObjectKey(filter)}
            onClick={() => onFilterRemoveRequest(filter)}
          >
            {filter.label}
          </TransparentButton>
        );
      })}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  column-gap: 8px;
`;
