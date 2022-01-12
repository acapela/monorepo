import { configure, _getGlobalState as getMobxSettingsObject } from "mobx";
import React from "react";

import { IS_DEV } from "@aca/shared/dev";
import { isServer } from "@aca/shared/isServer";

/**
 * Note: This is probably the most hacky part of the entire codebase, but it is only used in dev.
 *
 * This will setup warnings for access to mobx store, but only if reading from mobx in components that are not observers.
 */
export function setupDevIncorrectMobxUseageWarnings() {
  if (!IS_DEV || isServer) return;

  /**
   * Mobx does not by default allow 'conditional' warnings. You either always warn (which we dont want, eg. reading state inside effect or outside of react is fully ok).
   *
   * We need it only in components as it might lead to tricky bugs with not updating components.
   *
   * Thus, we'll replace 'public api' options: `observableRequiresReaction` and `computedRequiresReaction`:
   * by default they're simply 'booleans', we'll replace them with getters so we can perform conditional check each time mobx checks
   * if it should warn.
   */
  const mobxSettings = getMobxSettingsObject();

  configure({
    // Btw. we still want to require actions for mobx updates (this is not hacky)
    enforceActions: "always",
    // Let's initially set warnings to true, so mobx properly sets up read watching
    observableRequiresReaction: true,
    computedRequiresReaction: true,
  });

  // Remove 'plain boolean' settings and add getters instead that will conditionally warn
  Reflect.deleteProperty(mobxSettings, "observableRequiresReaction");
  Reflect.defineProperty(mobxSettings, "observableRequiresReaction", {
    get() {
      devWarnIfCurrentlyRenderingButNotObserver();
      // We dont want default mobx warning - we'll warn on our own with a bit more helpful warning
      return false;
    },
  });

  // Same for computed values
  Reflect.deleteProperty(mobxSettings, "computedRequiresReaction");
  Reflect.defineProperty(mobxSettings, "computedRequiresReaction", {
    get() {
      devWarnIfCurrentlyRenderingButNotObserver();
      return false;
    },
  });
}

/**
 * This function mimics original https://github.com/mobxjs/mobx/blob/6b160e39186004ef4a9ca75ddceca76c5de12e5e/packages/mobx/src/core/derivation.ts#L150
 * but with condition that react is currently rendering.
 */
function devWarnIfCurrentlyRenderingButNotObserver() {
  const mobxSettings = getMobxSettingsObject();

  // We're already in observer (eg observer component, any action, runInAction etc. It is all good so we dont need to warn)
  if (mobxSettings.allowStateReads) return;

  // Get function of component that is currently BEING rendered (hacky!)
  const currentlyRenderingFunction = getCurrentlyRenderingComponentFunction();

  // No component is currently rendering, we read mobx outside of react or inside useEffect etc. This is fine.
  if (!currentlyRenderingFunction) {
    return;
  }

  // Log actual component so it is easy to find it in codebase
  console.info(currentlyRenderingFunction);
  // Some component is rendering and it is not observer! (We know it because if it was observer, mobxSettings.allowStateReads would be true)
  throw new Error(
    `Using mobx state inside component that is not observer (check console to see what component to wrap in observer(Component))`
  );
}

/**
 * Will return component that is currently being rendered by react
 */
function getCurrentlyRenderingComponentFunction() {
  // XD
  const internals = Reflect.get(React, "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED");

  // Let's be super crash-careful here as it is not public api (note it did not change since React exists or most of its life)
  // Fun fact - it is actually being used in very popular libs like Relay - eg. https://github.com/facebook/relay/blob/86842c141eb59b31269893f224bf24375a2b3539/packages/react-relay/readContext.js
  if (!internals) return null;

  // Fiber node of currently rendered component
  const ownerFiber = internals.ReactCurrentOwner.current;

  if (!ownerFiber) return null;

  // Fiber .type is function of component
  return ownerFiber.type ?? null;
}
