import { MessageTaskDueDate, TeamMember, TeamMemberSlack, User } from "@aca/db";

export type TeamMemberWithSlack = TeamMember & {
  team_member_slack: TeamMemberSlack;
};

export type TopicVM = {
  id: string;
  name: string;
  user?: User;
  message: {
    message_task_due_date: MessageTaskDueDate | null;
  }[];
};
