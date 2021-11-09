import { useApolloClient } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import styled from "styled-components";

import { logout } from "~frontend/auth/logout";
import { useCurrentUserTokenData } from "~frontend/authentication/useCurrentUser";
import { useCurrentTeamContext } from "~frontend/team/CurrentTeam";
import { ErrorView } from "~frontend/views/ErrorView";
import { assert } from "~shared/assert";
import { devAssignWindowVariable } from "~shared/dev";
import { useAsyncEffect } from "~shared/hooks/useAsyncEffect";
import { Button } from "~ui/buttons/Button";
import { theme } from "~ui/theme";

import { ClientDb, createNewClientDb, forceClientDbReload } from "./createNewClientDb";
import { LoadingScreen } from "./LoadingScreen";

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

  devAssignWindowVariable("db", db);

  const recoverOptions = (
    <UIFallbackHolder>
      <Button
        isWide
        kind="primary"
        onClick={() => {
          forceClientDbReload();
          window.location.reload();
        }}
      >
        Reload
      </Button>
      <Button
        isWide
        onClick={() => {
          forceClientDbReload();
          logout();
        }}
      >
        Log out
      </Button>
    </UIFallbackHolder>
  );

  if (error) {
    console.error(error);
    return (
      <ErrorView
        title="Failed to load app data"
        description="This might be due to using the app in private mode or disk being out of space."
      >
        {recoverOptions}
      </ErrorView>
    );
  }

  return (
    <reactContext.Provider value={db}>
      {canRender && children}
      <AnimatePresence>
        {!canRender && (
          <LoadingScreen
            longLoadingFallback={{
              timeout: 2500,
              hint: "It takes a bit too long...",
              fallbackNode: recoverOptions,
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

const UIFallbackHolder = styled.div`
  display: flex;
  ${theme.spacing.actions.asGap};
  min-width: 280px;
`;
