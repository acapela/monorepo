import {
  Account,
  Attachment,
  DecisionVote,
  LinearIssue,
  Message,
  MessageReaction,
  MessageTaskDueDate,
  Task,
  TaskSlackMessage,
  Team,
  TeamMember,
  TeamMemberSlack,
  TeamSlackInstallation,
  Topic,
  TopicMember,
  Transcription,
  User,
} from "@aca/db";

import { createHasuraEventsHandler } from "../hasura";

export const hasuraEvents = createHasuraEventsHandler<{
  account_updates: Account;
  decision_vote_updates: DecisionVote;
  message_updates: Message;
  task_updates: Task;
  task_slack_message_updates: TaskSlackMessage;
  message_task_due_date_updates: MessageTaskDueDate;
  message_reaction_updates: MessageReaction;
  team_updates: Team;
  team_slack_installation_updates: TeamSlackInstallation;
  team_member_slack_updates: TeamMemberSlack;
  topic_updates: Topic;
  topic_member_updates: TopicMember;
  attachment_updates: Attachment;
  transcription_updates: Transcription;
  team_member_updates: TeamMember;
  user_updates: User;
  linear_issue_updates: LinearIssue;
}>();
