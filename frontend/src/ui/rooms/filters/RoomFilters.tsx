import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useList } from "react-use";
import styled from "styled-components";
import { Button } from "~ui/buttons/Button";
import { IconChevronDown } from "~ui/icons";
import { PopoverMenu } from "~ui/popovers/PopoverMenu";
import { createSortByDueDateFilter, createSortByLatestActivityFilter, createUserFilter } from "./factories";
import { getUsersFromRoomCriteriaList, RoomCriteria } from "./filter";
import { FiltersList } from "./FiltersList";
import { ParticipantsPickerMenu } from "./ParticipantsPickerMenu";

type FilterPickingStage = "off" | "main" | "participants";

interface Props {
  initialFilters?: RoomCriteria[];
  onFiltersChange: (filters: RoomCriteria[]) => void;
  className?: string;
}

export const RoomFilters = styled(function RecentTopicFilters({
  onFiltersChange,
  className,
  initialFilters = [],
}: Props) {
  const [filters, { push: addFilter, filter: applyFilterToFiltersList }] = useList<RoomCriteria>(initialFilters);

  function removeFilter(filterToRemove: RoomCriteria) {
    applyFilterToFiltersList((existingFilter) => existingFilter !== filterToRemove);
  }

  function handleAddFilter(filterToAdd: RoomCriteria) {
    if (hasFilter(filterToAdd)) {
      return;
    }

    addFilter(filterToAdd);
  }

  function hasFilter(filterToCheck: RoomCriteria) {
    return filters.some((existingFilter) => existingFilter.key === filterToCheck.key);
  }

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters]);

  const [stage, setStage] = useState<FilterPickingStage>("off");
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <AnimateSharedLayout>
      <UIHolder className={className}>
        <FiltersList filters={filters} onFilterRemoveRequest={removeFilter} />
        <Button
          kind="secondary"
          key="add-filter"
          ref={buttonRef}
          icon={<IconChevronDown />}
          onClick={() => setStage("main")}
        >
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
              selectedUsers={getUsersFromRoomCriteriaList(filters)}
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

const UIHolder = styled.div<{}>`
  display: flex;
  column-gap: 8px;
  height: 52px;
  align-items: stretch;
`;
