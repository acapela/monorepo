import { useApolloClient } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import { PropsWithChildren, createContext, useContext, useState } from "react";

import { useCurrentUserTokenData } from "@aca/frontend/authentication/useCurrentUser";
import { useCurrentTeamContext } from "@aca/frontend/team/CurrentTeam";
import { AppRecoveryButtons } from "@aca/frontend/utils/AppRecoveryButtons";
import { ErrorView } from "@aca/frontend/views/ErrorView";
import { useReportPageReady } from "@aca/shared/analytics/useReportPageReady";
import { assert } from "@aca/shared/assert";
import { devAssignWindowVariable } from "@aca/shared/dev";
import { useAsyncEffect } from "@aca/shared/hooks/useAsyncEffect";

import { ClientDb, createNewClientDb } from "./createNewClientDb";
import { LoadingScreen } from "./LoadingScreen";

const reactContext = createContext<ClientDb | null>(null);

// How long do we wait to show too long loading warning and recovery tools
const TIME_TO_SHOW_LOADING_WARNING = 7000;

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
    return (
      <ErrorView
        title="Failed to load app data"
        description="This might be due to using the app in private mode or disk being out of space."
      />
    );
  }

  return (
    <reactContext.Provider value={db}>
      {canRender && children}
      <AnimatePresence>
        {!canRender && (
          <LoadingScreen
            longLoadingFallback={{
              timeout: TIME_TO_SHOW_LOADING_WARNING,
              hint: "It takes a bit too long...",
              fallbackNode: <AppRecoveryButtons />,
            }}
          />
        )}
      </AnimatePresence>
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
