import { createContext, PropsWithChildren, useContext, useRef, useState } from "react";
import { useConst } from "~shared/hooks/useConst";
import { assert } from "./assert";
import { createChannel } from "./channel";
import { updateValue, ValueUpdater } from "./updateValue";

interface SharedStateContext<T> {
  useValue(): T;
  useSelector<S>(selector: (value: T) => S): S;
  update(updater: ValueUpdater<T>): void;
  getValue(): T;
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
 * const [TopicStoreContext, useTopicContext] = createSharedStateContext<State, ContextProviderProps>(props => {
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
 * const topicContext = useTopicStore();
 *
 * Updating the state.
 *
 * There are 2 ways of updating the state.
 *
 * First is to just provide new state value:
 *
 * topicContext.update({topicId: 'abc', currentlyReplyingToMessageId: 'cde'})
 *
 * Second is to use updater function which is based on immer, so you can mutate draft in the callback:
 *
 * topicContext.update(draft => draft.currentlyReplyingToMessageId = 'abc')
 *
 * If an update is made, all components using 'topicContext.useValue()' will be re-rendered
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function createSharedStateContext<T, P = {}>(initialValueInitializator: (contextProviderProps: P) => T) {
  const context = createContext<SharedStateContext<T> | null>(null);

  function useSharedStateContext() {
    const rawContextValue = useContext(context);

    assert(rawContextValue, "Accessing shared state context is only allowed inside corresponding context provider.");
    return rawContextValue;
  }

  function SharedStateContextProvider(props: PropsWithChildren<P>) {
    const initialValue = useConst(() => initialValueInitializator(props));

    const lastValueRef = useRef(initialValue);

    const channel = useConst(() => createChannel<T>());

    channel.useSubscribe((newValue) => {
      lastValueRef.current = newValue;
    });

    function update(updaterOrNewState: ValueUpdater<T>) {
      const newValueState = updateValue(lastValueRef.current, updaterOrNewState);

      channel.publish(newValueState);
    }

    /**
     * This hook will use shared state value.
     *
     * It has very similar API to regular useState hook, but updates will be broadcasted to all other users of this state
     * in the same context.
     *
     * Also update function supports immer based state mutations.
     */
    function useValue() {
      const [value, setValue] = useState(lastValueRef.current);

      channel.useSubscribe(setValue);

      return value;
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
    function useSelector<S>(selector: (stateValue: T) => S) {
      const [selectedValue, setSelectedValue] = useState(() => {
        return selector(lastValueRef.current);
      });

      channel.useSubscribe((newStateValue) => {
        const newSelectedValue = selector(newStateValue);

        setSelectedValue(newSelectedValue);
      });

      return selectedValue as S;
    }

    function getValue() {
      return lastValueRef.current;
    }

    const contextValue = useConst<SharedStateContext<T>>(() => {
      return {
        getValue,
        useSelector,
        useValue,
        update,
      };
    });

    return <context.Provider value={contextValue}>{props.children}</context.Provider>;
  }

  return [SharedStateContextProvider, useSharedStateContext] as const;
}
