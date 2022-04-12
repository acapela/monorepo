import { notificationFigmaCommentEntity } from "./figma/comment";
import { notificationGitHubEntity } from "./github/issue";
import { notificationJiraEntity } from "./jira/issue";
import { notificationLinearEntity } from "./linear/issue";
import { notificationNotionEntity } from "./notion/baseNotification";
import { notificationSlackMessageEntity } from "./slack/message";

export const innerEntities = [
  notificationNotionEntity,
  notificationSlackMessageEntity,
  notificationFigmaCommentEntity,
  notificationLinearEntity,
  notificationJiraEntity,
  notificationGitHubEntity,
];
