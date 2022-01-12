import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import { ReactNode } from "react";

import { createChannel } from "@aca/shared/channel";
import { createResolvablePromise } from "@aca/shared/promises";

/**
 * This module allows creating imperative functions that render some UI.
 *
 * For example
 *
 * Let's say we want to ask user for email. We can do it with `window.prompt` but it's ugly.
 *
 * We can create <Modal> component and render it wherever needed and connect it with some local state
 *
 * ```ts
 * const [email, setEmail] = useState('');
 * {isModalOpened && <TextInputModal onChange={setEmail} onSubmit={handleSubmit} />
 * ```
 *
 * But in such a simple case like 'ask for email' it often requires a lot of boilerplate in the components.
 *
 * With this module you can create custom functions like 'prompt' that will render proper ui.
 *
 * eg.
 *
 * ```
 * type Options = {
 *   title: string
 * }
 * type Result = string;
 * const openPrompt = createPromiseUI<Options, Result>((options, resolve) => {
 *    const [value, setValue] = useState('');
 *    return <Modal title={options.title}><Input value={value} onChange={setValue} /><Button onClick={() => resolve(value)}>Submit</Button></Modal>
 * })
 * ```
 *
 * and then use it like
 *
 * async function getName() {
 *   const name = await openPrompt({title: 'What is your name?'});
 *
 *   console.info(`Your name is ${name}`);
 * }
 */

// TODO: I'm not sure PromiseUI is good name for it but have no better idea.

interface PromiseUIData<I, O> {
  id: number;
  input: I;
  resolvePromise: (data: O) => void;
  renderer: PromiseUIRenderer<I, O>;
}

type PromiseUIRenderer<I, O> = (input: I, resolve: (data: O) => void) => ReactNode;

// This channel keeps track of all currently running ui promises
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const uiPromisesListChannel = createChannel<Array<PromiseUIData<any, any>>>();

// Component able to render single ui promise
const SinglePromiseUIRenderer = observer(function SinglePromiseUIRenderer<I, O>({
  promiseUI,
}: {
  promiseUI: PromiseUIData<I, O>;
}) {
  return <>{promiseUI.renderer(promiseUI.input, promiseUI.resolvePromise)}</>;
});

/**
 * This component will render all currently active ui promises. It's good to put it somewhere global like in _app.tsx.
 */
export function PromiseUIRenderer() {
  const resolvingPromises = uiPromisesListChannel.useLastValue() ?? [];

  return (
    <AnimatePresence>
      {resolvingPromises.map((resolvingPromise) => {
        return <SinglePromiseUIRenderer key={resolvingPromise.id} promiseUI={resolvingPromise} />;
      })}
    </AnimatePresence>
  );
}

/**
 * This will add new ui promise to list of active ui promises and return function to undo.
 */
function addPromiseUIInProgress<I, O>(uiPromise: PromiseUIData<I, O>) {
  const currentUIPromises = uiPromisesListChannel.getLastValue() ?? [];

  uiPromisesListChannel.publish([...currentUIPromises, uiPromise]);

  return function remove() {
    const currentUIPromises = uiPromisesListChannel.getLastValue() ?? [];

    const uiPromisesWithoutThisOne = currentUIPromises.filter((existingUIPromise) => existingUIPromise !== uiPromise);

    uiPromisesListChannel.publish(uiPromisesWithoutThisOne);
  };
}

// Each ui promise needs to be rendered with different key.
let promiseId = 0;

export function createPromiseUI<I, O>(renderer: PromiseUIRenderer<I, O>) {
  let isInProgress = false;

  function start(input: I): Promise<O> {
    if (isInProgress) {
      return Promise.reject("Cannot initialize the same promise ui before is resolved.");
    }

    isInProgress = true;

    const resultPromise = createResolvablePromise<O>();

    const removeUIPromise = addPromiseUIInProgress({
      id: ++promiseId,
      input,
      renderer,
      resolvePromise(data) {
        removeUIPromise();
        resultPromise.resolve(data);
        isInProgress = false;
      },
    });

    return resultPromise.promise;
  }

  return start;
}
