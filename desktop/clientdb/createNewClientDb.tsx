import { ApolloClient } from "@apollo/client";

import { createClientDb } from "@aca/clientdb";
import { createIndexedDbAdapter } from "@aca/clientdb/adapters/indexed-db";
import { apolloContext, teamIdContext, userIdContext } from "@aca/clientdb/utils/context";
import { setupDevIncorrectMobxUseageWarnings } from "@aca/clientdb/utils/devIncorrectUsageWarnings";
import { clientdbForceRefreshCount, increaseClientDBForceRefreshCount } from "@aca/clientdb/utils/recoveryCounter";
import { IS_DEV, devAssignWindowVariable } from "@aca/shared/dev";
import { isClient } from "@aca/shared/document";

import { accountEntity } from "./account";
import { notificationListEntity } from "./list";
import { notificationEntity } from "./notification";
import { notificationAsanaEntity } from "./notification/asana/task";
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
import { notificationNotionUserInvitedEntity } from "./notification/notion/userInvited";
import { notificationNotionUserMentionedEntity } from "./notification/notion/userMentioned";
import { notificationSlackMessageEntity } from "./notification/slack/message";
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

export const appClientDbEntities = {
  user: userEntity,

  team: teamEntity,
  teamMember: teamMemberEntity,

  notionSpace: notionSpaceEntity,
  notionSpaceUser: notionSpaceUserEntity,

  notification: notificationEntity,
  notificationList: notificationListEntity,
  notificationNotion: notificationNotionEntity,
  notificationSlackMessage: notificationSlackMessageEntity,
  notificationNotionUserMentioned: notificationNotionUserMentionedEntity,
  notificationNotionCommented: notificationNotionCommentedEntity,
  notificationNotionUserInvited: notificationNotionUserInvitedEntity,
  notificationFigmaComment: notificationFigmaCommentEntity,
  notificationLinear: notificationLinearEntity,
  notificationJira: notificationJiraEntity,
  notificationGitHub: notificationGitHubEntity,
  notificationGmail: notificationGmailEntity,
  notificationAsana: notificationAsanaEntity,

  account: accountEntity,

  gmailAccount: gmailAccountEntity,
  githubInstallation: githubInstallationEntity,

  userSlackInstallation: userSlackInstallationEntity,
  userSlackChannelsByTeam: userSlackChannelsByTeamEntity,
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
