import { ApolloClient, useApolloClient } from "@apollo/client";
import { configure } from "mobx";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

import { createClientDb } from "~clientdb";
import { useCurrentUserTokenData } from "~frontend/authentication/useCurrentUser";
import { teamInvitationEntity } from "~frontend/clientdb/teamInvitation";
import { teamMemberEntity } from "~frontend/clientdb/teamMember";
import { useCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import { assert } from "~shared/assert";
import { isDev } from "~shared/dev";

import { attachmentEntity } from "./attachment";
import { createIndexedDbAdapter } from "./indexeddb/adapter";
import { messageEntity } from "./message";
import { messageReactionEntity } from "./messageReaction";
import { taskEntity } from "./task";
import { teamEntity } from "./team";
import { topicEntity } from "./topic";
import { userEntity } from "./user";
import { apolloContext, teamIdContext, userIdContext } from "./utils/context";

if (isDev()) {
  configure({
    observableRequiresReaction: true,
    computedRequiresReaction: true,
    enforceActions: "always",
  });
}

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
      message: messageEntity,
      attachment: attachmentEntity,
      team: teamEntity,
      teamMember: teamMemberEntity,
      teamInvitation: teamInvitationEntity,
      task: taskEntity,
      messageReaction: messageReactionEntity,
    }
  );

  return clientdb;
}

type ThenType<T> = T extends Promise<infer I> ? I : never;

type ClientDb = ThenType<ReturnType<typeof createNewClientDb>>;

const reactContext = createContext<ClientDb | null>(null);

export function ClientDbProvider({ children }: PropsWithChildren<{}>) {
  const [db, setDb] = useState<ClientDb | null>(null);
  const [canRender, setCanRender] = useState(false);
  const teamId = useCurrentTeamId();
  const userId = useCurrentUserTokenData()?.id ?? null;
  const apolloClient = useApolloClient();

  useEffect(() => {
    setDb(null);
    setCanRender(false);

    if (!userId || !apolloClient) {
      setCanRender(true);
      return;
    }
    const newDbPromise: Promise<ClientDb> = createNewClientDb(userId, teamId, apolloClient);

    let isCancelled = false;

    newDbPromise.then((newDb) => {
      if (isCancelled) return;
      setDb(newDb);
      setCanRender(true);
    });

    return () => {
      isCancelled = true;
      newDbPromise.then((newDb) => {
        newDb.destroy();
      });
    };
  }, [userId, teamId, apolloClient]);

  return (
    <reactContext.Provider value={db}>
      {canRender && children}
      {!canRender && <div>Loading...</div>}
    </reactContext.Provider>
  );
}

export function useDb() {
  const db = useContext(reactContext);

  assert(db, "Used outside ClientDbProvider or without being logged in");

  return db;
}

// Used whenever we'd like to do checks without before knowing users's logging state
export function useUnsafeDb(): null | ClientDb {
  return useContext(reactContext);
}
