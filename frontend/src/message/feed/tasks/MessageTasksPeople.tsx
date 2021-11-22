import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React, { useRef, useState } from "react";
import styled from "styled-components";

import { TaskEntity } from "~frontend/clientdb/task";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { isNotNullish } from "~shared/nullish";
import { UIDropdownPanelBody } from "~ui/popovers/DropdownPanelBody";
import { Popover } from "~ui/popovers/Popover";
import { theme } from "~ui/theme";

import { MessageTask } from "./MessageTask";

interface Props {
  tasks: TaskEntity[];
}

export const MessageTasksPeople = observer(function MessageTasksPeople({ tasks }: Props) {
  const users = tasks.map((task) => task.assignedUser).filter(isNotNullish);

  const ref = useRef<HTMLDivElement>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <>
      <UIHolder ref={ref} onClick={() => setIsPopoverOpen(true)}>
        <AvatarList maxVisibleCount={3} users={users} />
        <UICountLabel>
          {users.length} {users.length !== 1 ? "recipients" : "recipient"}
        </UICountLabel>
      </UIHolder>
      <AnimatePresence>
        {isPopoverOpen && (
          <Popover anchorRef={ref} placement="bottom" onClickOutside={() => setIsPopoverOpen(false)} enableScreenCover>
            <UICollapsedTasks>
              {tasks.map((task) => (
                <MessageTask key={task.id} task={task} />
              ))}
            </UICollapsedTasks>
          </Popover>
        )}
      </AnimatePresence>
    </>
  );
});

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  ${theme.spacing.actions.asGap};
  cursor: pointer;
`;

const UICountLabel = styled.div``;

const UICollapsedTasks = styled(UIDropdownPanelBody)<{}>`
  display: flex;
  flex-direction: column;
  ${theme.spacing.actions.asGap};

  max-height: 400px;
  overflow-y: auto;

  ${MessageTask} {
    ${theme.transitions.hover("all")};
    ${theme.colors.panels.popover.withBorder.interactive};
  }
`;
