import { autorun, computed, configure, makeAutoObservable, runInAction } from "mobx";
import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { useConst } from "~shared/hooks/useConst";
import { assert } from "./assert";

export function select<T>(selector: () => T): T {
  return computed(selector).get();
}

export function useAutorun(runner: () => void) {
  useEffect(() => {
    return autorun(runner);
  });
}

export function createActionHandler(handler: () => void) {
  return () => {
    runInAction(() => {
      handler();
    });
  };
}

configure({
  // Not sure if we want to enable this. By default mobx will warn when updating state outside of runInAction call or
  // store updating itself (store 'methods' will automatically be wrapped in runInAction) (https://mobx.js.org/actions.html)
  enforceActions: "never",
});

// eslint-disable-next-line @typescript-eslint/ban-types
export function createStoreContext<T extends object, P = {}>(
  initialValueInitializator: (contextProviderProps: P) => T
) {
  const context = createContext<T | null>(null);

  function useSharedStateContext() {
    const rawContextValue = useContext(context);

    assert(rawContextValue, "Accessing shared state context is only allowed inside corresponding context provider.");
    return rawContextValue;
  }

  function createStore(props: P) {
    const rawResult = initialValueInitializator(props);

    return makeAutoObservable(rawResult);
  }

  function SharedStateContextProvider(props: PropsWithChildren<P>) {
    const initialValue = useConst(() => createStore(props));

    return <context.Provider value={initialValue}>{props.children}</context.Provider>;
  }

  return [SharedStateContextProvider, useSharedStateContext] as const;
}
