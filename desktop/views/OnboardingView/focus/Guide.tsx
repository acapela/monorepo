import { AnimatePresence, Transition } from "framer-motion";
import { sortBy, throttle } from "lodash";
import { action, autorun, computed, makeAutoObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React, { PropsWithChildren, ReactNode, createContext, useContext, useEffect, useRef } from "react";
import styled, { css, keyframes } from "styled-components";

import { removeElementFromArray } from "@aca/shared/array";
import { assert } from "@aca/shared/assert";
import { useConst } from "@aca/shared/hooks/useConst";
import { createTimeout } from "@aca/shared/time";
import { getUUID } from "@aca/shared/uuid";
import { Popover } from "@aca/ui/popovers/Popover";
import { PresenceAnimator } from "@aca/ui/PresenceAnimator";
import { theme } from "@aca/ui/theme";

interface Props {
  content: ReactNode;
  index: number;
  children: (complete: () => void, isCurrent: boolean) => ReactNode;
  className?: string;
  onCompleted?: () => void;
  isDisabled?: boolean;
}

function pickNextGuideItem(pendingItems: GuideItem[]) {
  if (!pendingItems.length) return null;

  const sortedItems = sortBy(pendingItems, (item) => item.index);

  return sortedItems.at(0) ?? null;
}

const springTransition: Transition = {
  // duration: 1,
  type: "spring",
  stiffness: 250,
  damping: 20,
  mass: 2,
};

export const GuideItem = observer(({ content, index, children, className, onCompleted, isDisabled }: Props) => {
  const store = useGuideStore();
  const holderRef = useRef<HTMLDivElement>(null);
  const selfItem = useConst<GuideItem>(() => {
    return { id: getUUID(), index };
  });

  const currentItem = store.currentItem;

  const isCurrentItem = computed(() => currentItem === selfItem).get();

  useEffect(() => {
    if (isDisabled) return;
    store.pendingItems.push(selfItem);

    return () => {
      if (store.currentItem === selfItem) {
        store.currentItem = null;
      }

      removeElementFromArray(store.pendingItems, selfItem);
    };
  }, [isDisabled]);

  const complete = action(() => {
    if (store.currentItem !== selfItem) return;
    removeElementFromArray(store.pendingItems, selfItem);
    store.currentItem = null;
    store.completedItems.push(selfItem);
    onCompleted?.();
  });

  return (
    <UIHolder ref={holderRef} className={className} $indicateCurrent={isCurrentItem}>
      {children(complete, isCurrentItem)}
      <AnimatePresence>
        {isCurrentItem && (
          <NonClickablePopover anchorRef={holderRef} placement="bottom">
            <UIGuidePanel
              presenceStyles={{ y: [20, 0], opacity: [0, 1], scale: [0.9, 1] }}
              transition={springTransition}
            >
              {content}
            </UIGuidePanel>
          </NonClickablePopover>
        )}
      </AnimatePresence>
    </UIHolder>
  );
});

const UIHolder = styled.div<{ $indicateCurrent: boolean }>`
  ${(props) =>
    props.$indicateCurrent &&
    css`
      /* ${wiggle} */

      /* box-shadow: 0 0 10px ${theme.colors.primary.opacity(0.5).value}; */
      /* border-radius: 6px; */
    `};
`;

interface GuideItem {
  id: string;
  index: number;
}

function createGuideStore() {
  return makeAutoObservable(
    {
      currentItem: null as GuideItem | null,
      pendingItems: [] as GuideItem[],
      completedItems: [] as GuideItem[],
    },
    { currentItem: observable.ref, pendingItems: observable.struct, completedItems: observable.struct }
  );
}

type GuideStore = ReturnType<typeof createGuideStore>;

const guideContext = createContext<GuideStore | null>(null);

export function GuideContext({ children, startDelay }: PropsWithChildren<{ startDelay?: number }>) {
  const store = useConst(createGuideStore);

  useEffect(() => {
    function startOnboarding() {
      const scheduleShowNext = throttle(
        () => {
          const nextItem = pickNextGuideItem(store.pendingItems);

          store.currentItem = nextItem;
        },
        250,
        { leading: false }
      );

      const stop = autorun(() => {
        if (store.currentItem) return;

        store.pendingItems.length;

        scheduleShowNext();
      });

      return () => {
        store.currentItem = null; // for hot-reloading
        stop();
        scheduleShowNext.cancel();
      };
    }

    if (!startDelay) {
      return startOnboarding();
    }

    let stopOnboarding: () => void;

    const cancelStarting = createTimeout(() => {
      stopOnboarding = startOnboarding();
    }, startDelay);

    return () => {
      cancelStarting();
      if (stopOnboarding) {
        stopOnboarding();
      }
    };
  }, [startDelay]);

  return <guideContext.Provider value={store}>{children}</guideContext.Provider>;
}

function useGuideStore() {
  const store = useContext(guideContext);

  assert(store, "useGuideStore used outside of GuideContext");

  return store;
}

const WIGGLE_AMPLITUDE = 2;

export const wiggleAnimation = keyframes`
  0%, 70% {
    transform: translate3d(0px, 0, 0);
  }

  25% {
    transform: translate3d(${WIGGLE_AMPLITUDE}px, 0, 0);
  }

  50% {
    transform: translate3d(-${WIGGLE_AMPLITUDE}px, 0, 0);
  }
`;

export const wiggle = css`
  animation: ${wiggleAnimation} 1s infinite;
`;

const NonClickablePopover = styled(Popover)`
  pointer-events: none;
`;

const UIGuidePanel = styled(PresenceAnimator)`
  padding: 10px 15px;
  ${theme.colors.primary.withBorder.asBgWithReadableText};
  border-radius: 6px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 260px;
  line-height: 1.5;
  font-weight: 500;
  text-align: center;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    height: 10px;
    width: 10px;
    background-color: inherit;
    transform-origin: center;
    transform: translate(-50%, -50%) rotate(45deg);
    /* transform: rotate(45deg) translate3d(-90%, 0%, 0); */
  }

  /* ${wiggle} */
`;
