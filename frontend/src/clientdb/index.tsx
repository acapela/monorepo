import { ApolloClient, useApolloClient } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import { PropsWithChildren, createContext, useContext, useState } from "react";

import { createClientDb } from "~clientdb";
import { useCurrentUserTokenData } from "~frontend/authentication/useCurrentUser";
import { teamMemberEntity } from "~frontend/clientdb/teamMember";
import { teamMemberSlackEntity } from "~frontend/clientdb/teamMemberSlack";
import { topicMemberEntity } from "~frontend/clientdb/topicMember";
import { useCurrentTeamContext } from "~frontend/team/CurrentTeam";
import { assert } from "~shared/assert";
import { isDev } from "~shared/dev";
import { useAsyncEffect } from "~shared/hooks/useAsyncEffect";

import { attachmentEntity } from "./attachment";
import { createIndexedDbAdapter } from "./indexeddb/adapter";
import { lastSeenMessageEntity } from "./lastSeenMessage";
import { LoadingScreen } from "./LoadingScreen";
import { messageEntity } from "./message";
import { messageReactionEntity } from "./messageReaction";
import { taskEntity } from "./task";
import { teamEntity } from "./team";
import { teamSlackInstallationEntity } from "./teamSlackInstallation";
import { topicEntity } from "./topic";
import { topicEventEntity } from "./topicEvent";
import { transcriptionEntity } from "./transcription";
import { userEntity } from "./user";
import { apolloContext, teamIdContext, userIdContext } from "./utils/context";
import { setupDevIncorrectMobxUseageWarnings } from "./utils/devIncorrectUsageWarnings";

export function createNewClientDb(userId: string, teamId: string | null, apolloClient: ApolloClient<unknown>) {
  const clientdb = createClientDb(
    {
      db: {
        adapter: createIndexedDbAdapter(),
        nameSuffix: `acapela-team-${teamId ?? "no-team"}-user-${userId}`,
      },
      contexts: [userIdContext.create(userId), teamIdContext.create(teamId), apolloContext.create(apolloClient)],
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
    }
  );

  return clientdb;
}

type ThenType<T> = T extends Promise<infer I> ? I : never;

export type ClientDb = ThenType<ReturnType<typeof createNewClientDb>>;

const reactContext = createContext<ClientDb | null>(null);

if (isDev()) {
  setupDevIncorrectMobxUseageWarnings();
}

export function ClientDbProvider({ children }: PropsWithChildren<{}>) {
  const [db, setDb] = useState<ClientDb | null>(null);
  const [canRender, setCanRender] = useState(false);
  const teamManager = useCurrentTeamContext();
  const token = useCurrentUserTokenData();
  const userId = token?.id ?? null;
  const apolloClient = useApolloClient();

  useAsyncEffect(
    async ({ getIsCancelled, waitForPreviousEffectToResolve }) => {
      setDb(null);
      setCanRender(false);

      if (!userId || !apolloClient) {
        setCanRender(true);
        return;
      }

      if (teamManager.isLoading) return;

      // If db is closing and we'll create same one with the same name, but different version, while old one is still opened, it will be blocked by browser. Let's wait for
      // previous effect to finish as it'll call db.destroy()
      await waitForPreviousEffectToResolve();

      const newDb = await createNewClientDb(userId, teamManager.teamId, apolloClient);

      if (getIsCancelled()) {
        newDb.destroy();
        return;
      }

      setDb(newDb);
      setCanRender(true);

      return () => {
        newDb.destroy();
      };
    },
    [userId, teamManager.isLoading, teamManager.teamId, apolloClient]
  );

  // In dev, make currently used db usable via console
  if (isDev() && db) {
    Reflect.set(window, "db", db);
  }

  return (
    <reactContext.Provider value={db}>
      {canRender && children}
      <AnimatePresence>{!canRender && <LoadingScreen />}</AnimatePresence>
    </reactContext.Provider>
  );
}

export function useDb() {
  const db = useContext(reactContext);

  assert(db, "Used outside ClientDbProvider or without being logged in");

  return db;
}

// Used whenever we'd like to do checks without before knowing users's logging state
export function useNullableDb(): null | ClientDb {
  return useContext(reactContext);
}
