import { ApolloClient, useApolloClient } from "@apollo/client";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

import { createClientDb } from "~clientdb";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { teamInvitationEntity } from "~frontend/clientdb/teamInvitation";
import { teamMemberEntity } from "~frontend/clientdb/teamMember";
import { useCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import { assert } from "~shared/assert";

import { attachmentEntity } from "./attachment";
import { createIndexedDbAdapter } from "./indexeddb/adapter";
import { messageEntity } from "./message";
import { messageReactionEntity } from "./messageReaction";
import { taskEntity } from "./task";
import { teamEntity } from "./team";
import { topicEntity } from "./topic";
import { userEntity } from "./user";
import { apolloContext, teamIdContext, userIdContext } from "./utils/context";

const DB_VERSION = 5;

export function createNewClientDb(userId: string | null, teamId: string | null, apolloClient: ApolloClient<unknown>) {
  const clientdb = createClientDb(
    {
      db: {
        dbAdapter: createIndexedDbAdapter(),
        dbVersion: DB_VERSION,
        dbPrefix: `acapela-team-${teamId ?? "no-team"}-user-${userId ?? "no-user"}`,
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

type ClientDb = ReturnType<typeof createNewClientDb>;

const reactContext = createContext<ClientDb | null>(null);

export function ClientDbProvider({ children }: PropsWithChildren<{}>) {
  const [db, setDb] = useState<ClientDb | null>(null);
  const teamId = useCurrentTeamId();
  const userId = useCurrentUser()?.id ?? null;
  const apolloClient = useApolloClient();

  useEffect(() => {
    const newDb = createNewClientDb(userId, teamId, apolloClient);

    setDb(newDb);

    return () => {
      // todoc db.destroy()
    };
  }, [userId, teamId, apolloClient]);

  return (
    <reactContext.Provider value={db}>
      {!!db && children}
      {!db && <div>Loading...</div>}
    </reactContext.Provider>
  );
}

export function useDb() {
  const db = useContext(reactContext);

  assert(db, "Used outside ClientDbProvider");

  return db;
}
