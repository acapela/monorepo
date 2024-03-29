import { notificationAcapelaEntity } from "./acapela";
import { notificationAsanaEntity } from "./asana/task";
import { notificationClickUpEntity } from "./clickup/task";
import { notificationDriveEntity } from "./drive/activity";
import { notificationFigmaCommentEntity } from "./figma/comment";
import { notificationGitHubEntity } from "./github/issue";
import { notificationGmailEntity } from "./gmail/message";
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
  notificationGmailEntity,
  notificationAsanaEntity,
  notificationDriveEntity,
  notificationClickUpEntity,
  notificationAcapelaEntity,
];
