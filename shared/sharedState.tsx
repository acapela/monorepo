import produce, { Draft } from "immer";
import { createContext, MutableRefObject, PropsWithChildren, useContext, useRef, useState } from "react";
import { useConst } from "~shared/hooks/useConst";
import { assert } from "./assert";
import { Channel, createChannel } from "./channel";

interface SharedStateContext<T> {
  // All context values are supposed to be never updated directly to avoid entire content of context being re-rendered.

  // We use ref of last value so it can be changed without re-render
  lastValueRef: MutableRefObject<T>;

  // Channel allows subscribing to state changes, but channel itself is always the same object so new values published to it
  // will not cause context re-render
  channel: Channel<T>;
}

/**
 * This function allows creating shared state that can be used across multiple components in the same context.
 *
 * If any of components will update the value, all other components in the same context will re-render.
 *
 * Usage
 *
 * interface State {
 *   topicId: string;
 *   currentlyReplyingToMessageId: string | null
 * }
 *
 * interface ContextProviderProps {
 *   topicId: string;
 * }
 *
 * const [TopicStoreContext, useTopicStore] = createSharedStateContext<State, ContextProviderProps>(props => {
 *   return {
 *     topicId: props.topicId;
 *     currentlyReplyingToMessageId: null
 *   }
 * })
 *
 * To render context:
 *
 * <TopicStoreContext topicId="abc">content</TopicStoreContext>
 *
 * To use the state:
 *
 * const [state, updateState] = useTopicStore();
 *
 * Updating the state.
 *
 * There are 2 ways of updating the state.
 *
 * First is to just provide new state value:
 *
 * updateState({topicId: 'abc', currentlyReplyingToMessageId: 'cde'})
 *
 * Second is to use updater function which is based on immer, so you can mutate draft in the callback:
 *
 * updateState(draft => draft.currentlyReplyingToMessageId = 'abc')
 *
 * If an update is made, all components using 'useTopicStore' will be re-rendered
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function createSharedStateContext<T, P = {}>(initialValueInitializator: (contextProviderProps: P) => T) {
  const context = createContext<SharedStateContext<T> | null>(null);

  function useSharedStateContext() {
    const rawContextValue = useContext(context);

    assert(rawContextValue, "Accessing shared state context is only allowed inside corresponding context provider.");
    return rawContextValue;
  }

  /**
   * This hook will use shared state value.
   *
   * It has very similar API to regular useState hook, but updates will be broadcasted to all other users of this state
   * in the same context.
   *
   * Also update function supports immer based state mutations.
   */
  function useSharedState() {
    const sharedStateContext = useSharedStateContext();
    const update = useSharedStateUpdate();

    const [value, setValue] = useState(sharedStateContext.lastValueRef.current);

    sharedStateContext.channel.useSubscribe(setValue);

    return [value, update] as const;
  }

  /**
   * This hooks allows updating shared state store without subscribing to it's changes.
   */
  function useSharedStateUpdate() {
    const sharedStateContext = useSharedStateContext();

    function update(updaterOrNewState: StateUpdaterOrNewState<T>) {
      const newValueState = updateStateWithStateUpdater(sharedStateContext.lastValueRef.current, updaterOrNewState);

      sharedStateContext.channel.publish(newValueState);
    }

    return update;
  }

  /**
   * It is useful if we want to follow shared state value, but only re-render if some specific change occurs.
   *
   * Use case:
   * Let's say you have 'editedMessageId' in the store and then you have <Message id={messageId} /> component.
   *
   * This component has to show edit tools only if its messageId === editedMessageId.
   *
   * It means it only has to re-render when value of messageId === editedMessageId changes, not when value of editedMessageId changes.
   *
   * Therefore it can be used like
   *
   * const amIEditedNow = useSharedStateSelector(state => state.editedMessageId === messageId);
   *
   * ---
   *
   * amIEditedNow is true / false and component will only re-render if result value changes.
   */
  function useSharedStateSelector<S>(selector: (stateValue: T) => S) {
    const sharedStateContext = useSharedStateContext();
    const updateStore = useSharedStateUpdate();

    const [selectedValue, setSelectedValue] = useState(() => {
      return selector(sharedStateContext.lastValueRef.current);
    });

    sharedStateContext.channel.useSubscribe((newStateValue) => {
      const newSelectedValue = selector(newStateValue);

      setSelectedValue(newSelectedValue);
    });

    return [selectedValue, updateStore] as const;
  }

  function SharedStateContextProvider(props: PropsWithChildren<P>) {
    const initialValue = useConst(() => initialValueInitializator(props));

    const lastValueRef = useRef(initialValue);

    const channel = useConst(() => createChannel<T>());

    channel.useSubscribe((newValue) => {
      lastValueRef.current = newValue;
    });

    const contextValue = useConst<SharedStateContext<T>>(() => {
      return {
        channel,
        lastValueRef,
      };
    });

    return <context.Provider value={contextValue}>{props.children}</context.Provider>;
  }

  return [SharedStateContextProvider, { useSharedState, useSharedStateSelector, useSharedStateUpdate }] as const;
}

type StateUpdater<T> = (draft: Draft<T>) => void;

type StateUpdaterOrNewState<T> = T | StateUpdater<T>;

/**
 * Creates new version of the state from the old one by either providing new state object or updater function based on immer.
 */
function updateStateWithStateUpdater<T>(currentState: T, updaterOrNewState: StateUpdaterOrNewState<T>) {
  if (typeof updaterOrNewState === "function") {
    const newStateValue = produce(currentState, (draft) => {
      (updaterOrNewState as StateUpdater<T>)(draft);

      return draft;
    });
    return newStateValue;
  }

  return updaterOrNewState as T;
}
