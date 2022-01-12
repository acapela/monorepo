import { autorun, computed, makeAutoObservable, runInAction } from "mobx";
import { PropsWithChildren, createContext, useContext, useEffect } from "react";

import { useConst } from "@aca/shared/hooks/useConst";

import { MessageOrError, assert } from "./assert";
import { useMethod } from "./hooks/useMethod";

export function select<T>(selector: () => T): T {
  return computed(selector).get();
}

export function useAutorun(runner: () => void) {
  const runnerRef = useMethod(runner);
  useEffect(() => {
    return autorun(runnerRef);
  }, []);
}

export function createActionHandler(handler: () => void) {
  return () => {
    runInAction(() => {
      handler();
    });
  };
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function createStoreContext<T extends object, P = {}>(
  initialValueInitializator: (contextProviderProps: P) => T
) {
  const context = createContext<T | null>(null);

  function useSharedStateContext() {
    const rawContextValue = useContext(context);

    // TODO: Topic now has room nullable, we have multiple legacy components being used both inside RoomContext and outside of it.
    // This is suboptimal and requires this context assert to be removed before components will be simplified and legacy dropped.
    // assert(rawContextValue, "Accessing shared state context is only allowed inside corresponding context provider.");
    return rawContextValue;
  }

  function useAssertSharedStateContext(message: MessageOrError = "Using shared store context outside of its provider") {
    const context = useSharedStateContext();

    assert(context, message);

    return context;
  }

  function createStore(props: P) {
    const rawResult = initialValueInitializator(props);

    return makeAutoObservable(rawResult);
  }

  function SharedStateContextProvider({ children, ...baseProps }: PropsWithChildren<P>) {
    const initialValue = useConst(() => createStore(baseProps as P));

    return <context.Provider value={initialValue}>{children}</context.Provider>;
  }

  return [SharedStateContextProvider, useSharedStateContext, useAssertSharedStateContext] as const;
}
