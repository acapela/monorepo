import { useRef } from "react";
import styled from "styled-components";

import { TaskEntity } from "~frontend/clientdb/task";
import { styledObserver } from "~shared/component";
import { useBoolean } from "~shared/hooks/useBoolean";
import { PopPresenceAnimator } from "~ui/animations";
import { Button } from "~ui/buttons/Button";
import { Popover } from "~ui/popovers/Popover";
import { theme } from "~ui/theme";

import { MessageTask } from "./MessageTask";

interface Props {
  tasks: TaskEntity[];
  className?: string;
}

export const CollapsedTasksButton = styledObserver(function CollapsedTasks({ tasks, className }: Props): JSX.Element {
  const ref = useRef<HTMLButtonElement>(null);

  const [isPopoverOpen, { set: openPopover, unset: closePopover }] = useBoolean(false);

  return (
    <>
      <Button className={className} ref={ref} kind="secondary" onClick={openPopover}>
        +{tasks.length}
      </Button>
      {isPopoverOpen && (
        <Popover anchorRef={ref} placement="left" onClickOutside={closePopover} enableScreenCover>
          <UICollapsedTasks>
            {tasks.map((task) => (
              <MessageTask key={task.id} task={task} />
            ))}
          </UICollapsedTasks>
        </Popover>
      )}
    </>
  );
})``;

const background = theme.colors.layout.background;

const UICollapsedTasks = styled(PopPresenceAnimator)<{}>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;

  max-height: 400px;
  overflow-y: auto;

  ${background.asBg};

  border: 1px solid ${background.border};

  ${theme.shadow.modal};
  ${theme.radius.panel};
`;
