import { ApolloClient } from "@apollo/client";

import { createClientDb } from "@aca/clientdb";
import { createIndexedDbAdapter } from "@aca/clientdb/adapters/indexed-db";
import { apolloContext, teamIdContext, userIdContext } from "@aca/clientdb/utils/context";
import { setupDevIncorrectMobxUseageWarnings } from "@aca/clientdb/utils/devIncorrectUsageWarnings";
import { clientdbForceRefreshCount, increaseClientDBForceRefreshCount } from "@aca/clientdb/utils/recoveryCounter";
import { IS_DEV, devAssignWindowVariable } from "@aca/shared/dev";
import { isClient } from "@aca/shared/document";

import { notificationEntity } from "./notification";
import { notificationFigmaCommentEntity } from "./notification/figma/comment";
import { notificationFilterEntity } from "./notification/filter";
import { notificationLinearEntity } from "./notification/linear/issue";
import { notificationNotionEntity } from "./notification/notion/baseNotification";
import { notificationNotionCommentedEntity } from "./notification/notion/commented";
import { notificationNotionUserInvitedEntity } from "./notification/notion/userInvited";
import { notificationNotionUserMentionedEntity } from "./notification/notion/userMentioned";
import { notificationSlackMessageEntity } from "./notification/slack/message";
import { teamEntity } from "./team";
import { teamMemberEntity } from "./teamMember";
import { userEntity } from "./user";
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

  notification: notificationEntity,
  notificationFilter: notificationFilterEntity,
  notificationNotion: notificationNotionEntity,
  notificationSlackMessage: notificationSlackMessageEntity,
  notificationNotionUserMentioned: notificationNotionUserMentionedEntity,
  notificationNotionCommented: notificationNotionCommentedEntity,
  notificationNotionUserInvited: notificationNotionUserInvitedEntity,
  notificationFigmaComment: notificationFigmaCommentEntity,
  notificationLinear: notificationLinearEntity,

  userSlackInstallation: userSlackInstallationEntity,
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
