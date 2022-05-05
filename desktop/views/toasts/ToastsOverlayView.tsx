import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle, css } from "styled-components";

import { focusMainViewRequest, focusSenderViewRequest } from "@aca/desktop/bridge/system";
import { toastsHeightChangeBridgeChannel, toastsStateBridge } from "@aca/desktop/bridge/toasts";
import { useDocumentEvent } from "@aca/shared/domEvents";
import { useDependencyChangeEffect } from "@aca/shared/hooks/useChangeEffect";
import { useDebouncedValue } from "@aca/shared/hooks/useDebouncedValue";
import { watchElementSize } from "@aca/shared/hooks/useResizeCallback";
import { createTimeout } from "@aca/shared/time";
import { MaybeCleanup } from "@aca/shared/types";
import { BodyPortal } from "@aca/ui/BodyPortal";

import { BridgeToast } from "./BridgeToast";
import { renderSlackToasts } from "./SlackToasts";

function controlledDebounce<T>(
  callback: (value: T) => void,
  timeGetter: (value: T, previousValue: T | null) => number
) {
  //
  let previousValue: T | null = null;
  let clearPrevious: MaybeCleanup;

  function clear() {
    clearPrevious?.();
    clearPrevious = undefined;
  }

  function callDebounced(value: T) {
    clear();

    const time = timeGetter(value, previousValue);
    previousValue = value;

    if (time <= 0) {
      callback(value);
      return;
    }

    clearPrevious = createTimeout(() => {
      callback(value);
    }, time);
  }

  callDebounced.clear = clear;

  return callDebounced;
}

export const ToastsOverlayView = observer(() => {
  const { toasts } = toastsStateBridge.get();
  const measurerRef = useRef<HTMLDivElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);

  const [isFocused, setIsFocused] = useState(false);

  useDocumentEvent("mouseenter", () => {
    setIsFocused(true);
    focusSenderViewRequest();
  });

  useDocumentEvent("mouseleave", () => {
    focusMainViewRequest();
    setIsFocused(false);
  });

  useDependencyChangeEffect(() => {
    if (!toasts.length) {
      focusMainViewRequest();
    }
  }, [toasts.length]);

  useEffect(() => {
    const holder = measurerRef.current;

    if (!holder) return;

    const requestNewHeight = controlledDebounce(
      (height: number) => {
        toastsHeightChangeBridgeChannel.send(height);
      },
      (heightNow, heightBefore) => {
        if (heightBefore === null) heightBefore = 0;

        if (heightNow > heightBefore) return 0;

        return 600;
      }
    );

    const stopWatchingSize = watchElementSize(
      holder,
      () => {
        const height = holder.getBoundingClientRect().height;
        requestNewHeight(height);
      },
      0
    );

    return () => {
      stopWatchingSize();
      requestNewHeight.clear();
    };
  }, []);

  const debouncedToasts = useDebouncedValue(toasts, 100);

  return (
    <>
      <UIHolder ref={holderRef}>
        <AnimatePresence>
          {debouncedToasts.map((toast) => {
            return <BridgeToast key={toast.key} toast={toast} animationsDelay={0.1} pauseAutoHide={isFocused} />;
          })}
          {renderSlackToasts({ animationsDelay: 0.1, pauseAutoHide: isFocused })}
        </AnimatePresence>
      </UIHolder>
      <BodyPortal>
        <UISizeMeasurerSpacer>
          <UISizeMeasurer ref={measurerRef}>
            {toasts.map((toast) => {
              return <BridgeToast key={toast.key} toast={toast} disablePositionalAnimations pauseAutoHide />;
            })}
            {renderSlackToasts({ disablePositionalAnimations: true, pauseAutoHide: true })}
          </UISizeMeasurer>
        </UISizeMeasurerSpacer>
      </BodyPortal>
      <BodyStyles />
    </>
  );
});

const BodyStyles = createGlobalStyle`
  body, html {
    background-color: transparent;
    position: fixed;
    inset: 0;
  }
`;

const spacingStyles = css`
  padding: 20px;
`;

const UIHolder = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position: fixed;
  inset: 0;
  justify-content: flex-end;
  align-items: stretch;
  ${spacingStyles};
`;

const UISizeMeasurerSpacer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  min-height: 1000px;
  pointer-events: none;
`;

const UISizeMeasurer = styled.div`
  ${spacingStyles};
  /* background-color: red; */
  display: flex;
  flex-direction: column;
  position: fixed;
  justify-content: flex-end;
  align-items: stretch;
  top: 0;
  left: 0;
  right: 0;
  opacity: 0;
`;
