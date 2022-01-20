import { useApolloClient } from "@apollo/client";
import React, { PropsWithChildren, createContext, useContext, useState } from "react";

import { useReportPageReady } from "@aca/shared/analytics/useReportPageReady";
import { assert } from "@aca/shared/assert";
import { devAssignWindowVariable } from "@aca/shared/dev";
import { useAsyncEffect } from "@aca/shared/hooks/useAsyncEffect";

import { useCurrentTeamContext } from "../auth/CurrentTeam";
import { useCurrentUserTokenData } from "../auth/useCurrentUser";
import { ClientDb, createNewClientDb } from "./createNewClientDb";

/**
 * TODO: We might want to do a more thorough migration of frontend/ClientDbProvider, I just went
 * for basic functionality
 */

const reactContext = createContext<ClientDb | null>(null);

export function ClientDbProvider({ children }: PropsWithChildren<{}>) {
  const [db, setDb] = useState<ClientDb | null>(null);
  const [error, setError] = useState<unknown | null>(null);
  const [canRender, setCanRender] = useState(false);
  const teamManager = useCurrentTeamContext();
  const token = useCurrentUserTokenData();
  const userId = token?.id ?? null;
  const apolloClient = useApolloClient();

  useAsyncEffect(
    async ({ getIsCancelled, waitForPreviousEffectToResolve }) => {
      try {
        setDb(null);
        setCanRender(false);

        if (teamManager.isLoading) return;

        if (!userId || !apolloClient) {
          setCanRender(true);
          return;
        }

        // If db is closing and we'll create same one with the same name, but different version, while old one is still opened, it will be blocked by browser. Let's wait for
        // previous effect to finish as it'll call db.destroy()
        await waitForPreviousEffectToResolve();

        const newDb = await createNewClientDb({
          userId,
          teamId: teamManager.teamId,
          apolloClient,
          onDestroyRequest: () => {
            setError(true);
            setDb(null);
            setCanRender(false);
            newDb.destroy();
          },
        });

        if (getIsCancelled()) {
          newDb.destroy();
          return;
        }

        setDb(newDb);
        setCanRender(true);
        setError(null);

        return () => {
          newDb.destroy();
        };
      } catch (error) {
        setCanRender(false);
        setError(error);
      }
    },
    [userId, teamManager.isLoading, teamManager.teamId, apolloClient]
  );

  useReportPageReady(teamManager.teamId ?? undefined, !error && canRender);

  devAssignWindowVariable("db", db);

  if (error) {
    console.error(error);
    return null;
  }

  return <reactContext.Provider value={db}>{canRender && children}</reactContext.Provider>;
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
