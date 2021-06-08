import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useList } from "react-use";
import styled from "styled-components";
import { Order_By } from "~frontend/gql";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { Button } from "~ui/buttons/Button";
import { IconChevronDown, IconFilter } from "~ui/icons";
import { PopoverMenu } from "~ui/popovers/PopoverMenu";
import { RecentTopicsFilter } from "./filter";
import { FiltersList } from "./FiltersList";
import { ParticipantsPickerMenu } from "./ParticipantsPickerMenu";

type FilterPickingStage = "off" | "main" | "participants";

interface Props {
  onFiltersChange: (filters: RecentTopicsFilter[]) => void;
  className?: string;
}

export const RecentTopicFilters = styled(function RecentTopicFilters({ onFiltersChange, className }: Props) {
  const [filters, { push: addFilter, filter: applyFilterToFiltersList }] = useList<RecentTopicsFilter>();

  function removeFilter(filterToRemove: RecentTopicsFilter) {
    applyFilterToFiltersList((existingFilter) => existingFilter !== filterToRemove);
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
                  onSelect: () =>
                    addFilter({
                      label: "Sort by due date [TODO]",
                      icon: <IconFilter />,
                      orderGetter() {
                        // TODO: Due date PR is awaiting
                        return {};
                      },
                    }),
                },
                {
                  label: "Sort by latest activity",
                  onSelect: () =>
                    addFilter({
                      label: "Sort by latest activity",
                      icon: <IconFilter />,
                      orderGetter() {
                        return { messages_aggregate: { max: { created_at: Order_By.Desc } } };
                      },
                    }),
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
              selectedUsers={[]}
              onUserSelected={(user) => {
                setStage("off");
                addFilter({
                  type: "user",
                  user,
                  label: user.name ?? "Unknown user",
                  icon: <UserAvatar user={user} size="small" />,
                  whereApplier(where) {
                    if (!where.members) where.members = {};
                    if (!where.members._or) where.members._or = [];
                    where.members._or.push({ user_id: { _eq: user.id } });
                  },
                });
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
