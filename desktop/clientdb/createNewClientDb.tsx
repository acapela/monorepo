import { ApolloClient } from "@apollo/client";

import { createClientDb } from "@aca/clientdb";
import { createIndexedDbAdapter } from "@aca/clientdb/adapters/indexed-db";
import { apolloContext, teamIdContext, userIdContext } from "@aca/clientdb/utils/context";
import { setupDevIncorrectMobxUseageWarnings } from "@aca/clientdb/utils/devIncorrectUsageWarnings";
import { clientdbForceRefreshCount, increaseClientDBForceRefreshCount } from "@aca/clientdb/utils/recoveryCounter";
import { IS_DEV, devAssignWindowVariable } from "@aca/shared/dev";
import { isClient } from "@aca/shared/document";

import { accountEntity } from "./account";
import { alertEntity } from "./alert";
import { alertReadReceiptEntity } from "./alert/readReceipt";
import { asanaAccountEntity } from "./asanaAccount";
import { asanaWebhookEntity } from "./asanaWebhook";
import { clickupTeamEntity } from "./clickupTeam";
import { notificationListEntity } from "./list";
import { notificationEntity } from "./notification";
import { notificationAcapelaEntity } from "./notification/acapela";
import { notificationAsanaEntity } from "./notification/asana/task";
import { notificationClickUpEntity } from "./notification/clickup/task";
import { notificationDriveEntity } from "./notification/drive/activity";
import { googleDriveFileEntity } from "./notification/drive/file";
import { notificationFigmaCommentEntity } from "./notification/figma/comment";
import { githubInstallationEntity } from "./notification/github/installation";
import { notificationGitHubEntity } from "./notification/github/issue";
import { gmailAccountEntity } from "./notification/gmail/account";
import { notificationGmailEntity } from "./notification/gmail/message";
import { notificationJiraEntity } from "./notification/jira/issue";
import { notificationLinearEntity } from "./notification/linear/issue";
import { notificationNotionEntity } from "./notification/notion/baseNotification";
import { notificationNotionCommentedEntity } from "./notification/notion/commented";
import { notionSpaceEntity } from "./notification/notion/notionSpace";
import { notionSpaceUserEntity } from "./notification/notion/notionSpaceUser";
import { notificationNotionReminderEntity } from "./notification/notion/reminder";
import { notificationNotionUserInvitedEntity } from "./notification/notion/userInvited";
import { notificationNotionUserMentionedEntity } from "./notification/notion/userMentioned";
import { notificationSlackMessageEntity } from "./notification/slack/message";
import { slackTeamEntity } from "./slackTeam";
import { teamEntity } from "./team";
import { teamMemberEntity } from "./teamMember";
import { userEntity } from "./user";
import { userSlackChannelsByTeamEntity } from "./userSlackChannelsByTeam";
import { userSlackInstallationEntity } from "./userSlackInstallation";

interface CreateNewClientDbInput {
  userId: string;
  teamId: string | null;
  apolloClient: ApolloClient<unknown>;
  onDestroyRequest?: () => void;
}

devAssignWindowVariable("reloadClientDb", () => {
  increaseClientDBForceRefreshCount();
  window.location.reload();
});

/**
 * Important notice!
 *
 * Order in this object is important.
 *
 * Entities that depend on other entities should be listed lower
 */
export const appClientDbEntities = {
  user: userEntity,

  team: teamEntity,
  teamMember: teamMemberEntity,

  notionSpace: notionSpaceEntity,
  notionSpaceUser: notionSpaceUserEntity,

  notificationList: notificationListEntity,
  notificationSlackMessage: notificationSlackMessageEntity,

  notificationAcapela: notificationAcapelaEntity,

  notificationNotionUserMentioned: notificationNotionUserMentionedEntity,
  notificationNotionCommented: notificationNotionCommentedEntity,
  notificationNotionUserInvited: notificationNotionUserInvitedEntity,
  notificationNotionReminder: notificationNotionReminderEntity,

  notificationNotion: notificationNotionEntity,

  notificationFigmaComment: notificationFigmaCommentEntity,
  notificationLinear: notificationLinearEntity,
  notificationJira: notificationJiraEntity,
  notificationGitHub: notificationGitHubEntity,
  notificationGmail: notificationGmailEntity,
  notificationAsana: notificationAsanaEntity,
  notificationDrive: notificationDriveEntity,
  notificationClickUp: notificationClickUpEntity,

  notification: notificationEntity,

  account: accountEntity,

  gmailAccount: gmailAccountEntity,
  googleDriveFile: googleDriveFileEntity,

  asanaAccount: asanaAccountEntity,
  asanaWebhook: asanaWebhookEntity,
  clickupTeam: clickupTeamEntity,

  githubInstallation: githubInstallationEntity,

  userSlackInstallation: userSlackInstallationEntity,
  userSlackChannelsByTeam: userSlackChannelsByTeamEntity,
  slackTeam: slackTeamEntity,

  alert: alertEntity,
  alertReadReceipt: alertReadReceiptEntity,
};

export function createNewClientDb({ userId, teamId, apolloClient, onDestroyRequest }: CreateNewClientDbInput) {
  const clientdb = createClientDb(
    {
      db: {
        adapter: createIndexedDbAdapter(),
        key: `${teamId ?? "no-team"}-${userId}-${clientdbForceRefreshCount.get()}`,
      },
      contexts: [userIdContext.create(userId), teamIdContext.create(teamId), apolloContext.create(apolloClient)],
      onDestroyRequest,
    },
    appClientDbEntities
  );

  return clientdb;
}

type ThenType<T> = T extends Promise<infer I> ? I : never;

export type ClientDb = ThenType<ReturnType<typeof createNewClientDb>>;

if (IS_DEV && isClient) {
  setupDevIncorrectMobxUseageWarnings();
}
