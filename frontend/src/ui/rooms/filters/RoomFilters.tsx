import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useList } from "react-use";
import styled from "styled-components";
import { UserBasicInfoFragment } from "~gql";
import { Button } from "~ui/buttons/Button";
import { IconChevronDown } from "~ui/icons";
import { PopoverMenu } from "~ui/popovers/PopoverMenu";
import { getIsUserFilter, RoomFilter } from "./filter";

import { createSortByDueDateFilter, createSortByLatestActivityFilter, createUserFilter } from "./factories";
import { FiltersList } from "./FiltersList";
import { ParticipantsPickerMenu } from "./ParticipantsPickerMenu";

type FilterPickingStage = "off" | "main" | "participants";

interface Props {
  initialFilters?: RoomFilter[];
  onFiltersChange: (filters: RoomFilter[]) => void;
  className?: string;
}

function getSelectedUsersFromTopicFilters(filters: RoomFilter[]) {
  const selectedMembers: UserBasicInfoFragment[] = [];

  for (const filter of filters) {
    if (!getIsUserFilter(filter)) {
      continue;
    }

    selectedMembers.push(filter.user);
  }

  return selectedMembers;
}

export const RoomFilters = styled(function RecentTopicFilters({
  onFiltersChange,
  className,
  initialFilters = [],
}: Props) {
  const [filters, { push: addFilter, filter: applyFilterToFiltersList }] = useList<RoomFilter>();

  function removeFilter(filterToRemove: RoomFilter) {
    applyFilterToFiltersList((existingFilter) => existingFilter !== filterToRemove);
  }

  function handleAddFilter(filterToAdd: RoomFilter) {
    if (hasFilter(filterToAdd)) {
      return;
    }

    addFilter(filterToAdd);
  }

  function hasFilter(filterToCheck: RoomFilter) {
    return filters.some((existingFilter) => existingFilter.key === filterToCheck.key);
  }

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters]);

  useEffect(() => {
    initialFilters.forEach(handleAddFilter);
  }, []);

  const [stage, setStage] = useState<FilterPickingStage>("off");
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <AnimateSharedLayout>
      <UIHolder className={className}>
        <FiltersList filters={filters} onFilterRemoveRequest={removeFilter} />
        <Button key="add-filter" ref={buttonRef} icon={<IconChevronDown />} onClick={() => setStage("main")}>
          Add filter...
        </Button>
        <AnimatePresence>
          {stage === "main" && (
            <PopoverMenu
              anchorRef={buttonRef}
              options={[
                {
                  label: "Filter by participants...",
                  onSelect: () => setStage("participants"),
                },
                {
                  label: "Sort by due date",
                  onSelect: () => handleAddFilter(createSortByDueDateFilter()),
                  isDisabled: hasFilter(createSortByDueDateFilter()),
                },
                {
                  label: "Sort by latest activity",
                  onSelect: () => handleAddFilter(createSortByLatestActivityFilter()),
                  isDisabled: hasFilter(createSortByLatestActivityFilter()),
                },
              ]}
              onCloseRequest={() => setStage("off")}
              onItemSelected={() => setStage("off")}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {stage === "participants" && (
            <ParticipantsPickerMenu
              anchorRef={buttonRef}
              onCloseRequest={() => setStage("off")}
              selectedUsers={getSelectedUsersFromTopicFilters(filters)}
              onUserSelected={(user) => {
                setStage("off");
                handleAddFilter(createUserFilter(user));
              }}
            />
          )}
        </AnimatePresence>
      </UIHolder>
    </AnimateSharedLayout>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  column-gap: 8px;

  ${Button} {
    /* Enforces all of filter buttons to be same size regardless of Icon sizes within */
    height: 52px;
  }
`;
