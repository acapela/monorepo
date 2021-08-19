import styled from "styled-components";

import { useCurrentTeamMembers } from "~frontend/gql/teams";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { TaskBasicInfoFragment, UserBasicInfoFragment } from "~gql";
import { theme } from "~ui/theme";

interface Props {
  tasksAuthor: UserBasicInfoFragment;
  tasks: TaskBasicInfoFragment[];
  className?: string;
}

export const MessageTasks = styled(function MessageTasks({ tasks, tasksAuthor, className }: Props) {
  const allTeamMembers = useCurrentTeamMembers();
  return (
    <UITasks className={className}>
      {tasks.map((task) => {
        const taskAssignee = allTeamMembers.find((member) => member.id === task.user_id);

        if (!taskAssignee) {
          return;
        }

        return (
          <UISingleTask key={task.id}>
            <UserAvatar user={tasksAuthor} size={"extra-small"} />
            &nbsp;
            <UIUserNameLabel>{tasksAuthor.name}</UIUserNameLabel>
            &nbsp; requested&nbsp;&nbsp;
            <UserAvatar user={taskAssignee} size={"extra-small"} />
            &nbsp;
            <UIUserNameLabel>{taskAssignee.name}`s</UIUserNameLabel>
            &nbsp;input
          </UISingleTask>
        );
      })}
    </UITasks>
  );
})``;

const UITasks = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const UISingleTask = styled.div<{}>`
  display: flex;
  align-items: center;
  color: ${theme.colors.layout.supportingText()};

  ${theme.font.body12.build()}
`;

const UIUserNameLabel = styled.span`
  /* color: ${theme.colors.layout.link()}; */
  ${theme.font.semibold.build()}
`;
