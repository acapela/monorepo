import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React, { useRef, useState } from "react";
import styled from "styled-components";

import { TaskEntity } from "@aca/frontend/clientdb/task";
import { AvatarList } from "@aca/frontend/ui/users/AvatarList";
import { isNotNullish } from "@aca/shared/nullish";
import { FadePresenceAnimator } from "@aca/ui/animations";
import { UIDropdownPanelBody } from "@aca/ui/popovers/DropdownPanelBody";
import { Popover } from "@aca/ui/popovers/Popover";
import { theme } from "@aca/ui/theme";

import { MessageTask } from "./MessageTask";

interface Props {
  tasks: TaskEntity[];
  label: string;
  isPrimary?: boolean;
}

export const MessageTasksPeople = observer(function MessageTasksPeople({ tasks, label, isPrimary = false }: Props) {
  const users = tasks.map((task) => task.assignedUser).filter(isNotNullish);

  const ref = useRef<HTMLDivElement>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <>
      <UIHolder ref={ref} onClick={() => setIsPopoverOpen(true)}>
        <AvatarList maxVisibleCount={3} users={users} />
        <UIMeta>
          <UICountLabel>
            {users.length} {users.length !== 1 ? "recipients" : "recipient"}
          </UICountLabel>
          <UIKindLabel $isPrimary={isPrimary}>{label}</UIKindLabel>
        </UIMeta>
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

const UIHolder = styled(FadePresenceAnimator)`
  display: flex;
  align-items: center;
  ${theme.spacing.actions.asGap};
  cursor: pointer;
`;

const UIMeta = styled.div``;

const UICountLabel = styled.div`
  ${theme.typo.item.title}
`;

const UIKindLabel = styled.div<{ $isPrimary: boolean }>`
  ${theme.typo.label.opacity(0.8).bold}
  ${(props) => props.$isPrimary && theme.colors.primary.asColor};
`;

const UICollapsedTasks = styled(UIDropdownPanelBody)<{}>`
  display: flex;
  flex-direction: column;

  max-height: 400px;

  ${MessageTask} {
    ${theme.transitions.hover("all")};
    ${theme.colors.panels.popover.interactive};
  }
`;
