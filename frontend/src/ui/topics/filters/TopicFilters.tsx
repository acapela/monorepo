import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useList } from "react-use";
import styled from "styled-components";
import { UserBasicInfoFragment } from "~gql";
import { Button } from "~ui/buttons/Button";
import { IconChevronDown } from "~ui/icons";
import { PopoverMenu } from "~ui/popovers/PopoverMenu";
import {
  createSortByDueDateFilter,
  createSortByLatestActivityFilter,
  createUserFilter,
  getIsUserFilter,
  TopicFilter,
} from "./filter";
import { FiltersList } from "./FiltersList";
import { ParticipantsPickerMenu } from "./ParticipantsPickerMenu";

type FilterPickingStage = "off" | "main" | "participants";

interface Props {
  onFiltersChange: (filters: TopicFilter[]) => void;
  className?: string;
}

function getSelectedUsersFromTopicFilters(filters: TopicFilter[]) {
  const selectedMembers: UserBasicInfoFragment[] = [];

  for (const filter of filters) {
    if (!getIsUserFilter(filter)) {
      continue;
    }

    selectedMembers.push(filter.user);
  }

  return selectedMembers;
}

export const TopicFilters = styled(function RecentTopicFilters({ onFiltersChange, className }: Props) {
  const [filters, { push: addFilter, filter: applyFilterToFiltersList }] = useList<TopicFilter>();

  function removeFilter(filterToRemove: TopicFilter) {
    applyFilterToFiltersList((existingFilter) => existingFilter !== filterToRemove);
  }

  function handleAddFilter(filterToAdd: TopicFilter) {
    if (hasFilter(filterToAdd)) {
      return;
    }

    addFilter(filterToAdd);
  }

  function hasFilter(filterToCheck: TopicFilter) {
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
`;
