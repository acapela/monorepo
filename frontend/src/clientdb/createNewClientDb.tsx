import { ApolloClient } from "@apollo/client";

import { createClientDb } from "~clientdb";
import { teamMemberEntity } from "~frontend/clientdb/teamMember";
import { teamMemberSlackEntity } from "~frontend/clientdb/teamMemberSlack";
import { topicMemberEntity } from "~frontend/clientdb/topicMember";
import { userGroupEntity, userGroupMemberEntity } from "~frontend/clientdb/userGroup";
import { IS_DEV, devAssignWindowVariable } from "~shared/dev";
import { isClient } from "~shared/document";

import { attachmentEntity } from "./attachment";
import { createIndexedDbAdapter } from "./indexeddb/adapter";
import { lastSeenMessageEntity } from "./lastSeenMessage";
import { messageEntity } from "./message";
import { messageReactionEntity } from "./messageReaction";
import { messageTaskDueDateEntity } from "./messageTaskDueDate";
import { clientdbForceRefreshCount, increaseClientDBForceRefreshCount } from "./recoveryCounter";
import { taskEntity } from "./task";
import { teamEntity } from "./team";
import { teamSlackInstallationEntity } from "./teamSlackInstallation";
import { topicEntity } from "./topic";
import { topicEventEntity } from "./topicEvent";
import { transcriptionEntity } from "./transcription";
import { userEntity } from "./user";
import { apolloContext, teamIdContext, userIdContext } from "./utils/context";
import { setupDevIncorrectMobxUseageWarnings } from "./utils/devIncorrectUsageWarnings";

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
  topic: topicEntity,
  topicMember: topicMemberEntity,
  message: messageEntity,
  attachment: attachmentEntity,
  team: teamEntity,
  teamMember: teamMemberEntity,
  teamMemberSlack: teamMemberSlackEntity,
  teamSlackInstallation: teamSlackInstallationEntity,
  task: taskEntity,
  messageReaction: messageReactionEntity,
  lastSeenMessage: lastSeenMessageEntity,
  transcription: transcriptionEntity,
  topicEvent: topicEventEntity,
  messageTaskDueDate: messageTaskDueDateEntity,
  userGroup: userGroupEntity,
  userGroupMember: userGroupMemberEntity,
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
