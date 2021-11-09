import { ApolloClient } from "@apollo/client";

import { createClientDb } from "~clientdb";
import { teamMemberEntity } from "~frontend/clientdb/teamMember";
import { teamMemberSlackEntity } from "~frontend/clientdb/teamMemberSlack";
import { topicMemberEntity } from "~frontend/clientdb/topicMember";
import { devAssignWindowVariable, isDev } from "~shared/dev";
import { isClient } from "~shared/document";
import { createLocalStorageValueManager } from "~shared/localStorage";

import { attachmentEntity } from "./attachment";
import { createIndexedDbAdapter } from "./indexeddb/adapter";
import { lastSeenMessageEntity } from "./lastSeenMessage";
import { messageEntity } from "./message";
import { messageReactionEntity } from "./messageReaction";
import { messageTaskDueDateEntity } from "./messageTaskDueDate";
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

const forceRefreshHask = createLocalStorageValueManager("clientdb-force-refresh-hash", 0);

export function forceClientDbReload() {
  forceRefreshHask.set(forceRefreshHask.get() + 1);
}

devAssignWindowVariable("reloadClientDb", () => {
  forceClientDbReload();
  window.location.reload();
});

export function createNewClientDb({ userId, teamId, apolloClient, onDestroyRequest }: CreateNewClientDbInput) {
  const clientdb = createClientDb(
    {
      db: {
        adapter: createIndexedDbAdapter(),
        key: `${teamId ?? "no-team"}-${userId}-${forceRefreshHask.get()}`,
      },
      contexts: [userIdContext.create(userId), teamIdContext.create(teamId), apolloContext.create(apolloClient)],
      onDestroyRequest,
    },
    {
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
    }
  );

  return clientdb;
}

type ThenType<T> = T extends Promise<infer I> ? I : never;

export type ClientDb = ThenType<ReturnType<typeof createNewClientDb>>;

if (isDev() && isClient) {
  setupDevIncorrectMobxUseageWarnings();
}
