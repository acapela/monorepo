import { AnimatePresence } from "framer-motion";
import React from "react";
import styled from "styled-components";

import { getObjectKey } from "@aca/shared/object";
import { BodyPortal } from "@aca/ui/BodyPortal";
import { theme } from "@aca/ui/theme";

import { removeToast, useToasts } from "./data";
import { ToastLabel } from "./ToastLabel";

export function ToastsRenderer() {
  const toasts = useToasts();

  return (
    <BodyPortal>
      <UIFlyer>
        <UIToastsHolder>
          <AnimatePresence>
            {toasts.map((toast) => {
              return <ToastLabel key={getObjectKey(toast)} toast={toast} onCloseRequest={removeToast} />;
            })}
          </AnimatePresence>
        </UIToastsHolder>
      </UIFlyer>
    </BodyPortal>
  );
}

const UIFlyer = styled.div<{}>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: ${theme.zIndex.toast};
  pointer-events: none;
`;

const TOAST_WIDTH_PX = 460;

const UIToastsHolder = styled.div<{}>`
  width: ${TOAST_WIDTH_PX}px;
  display: flex;
  flex-direction: column-reverse;

  ${ToastLabel} {
    margin-top: 8px;
    pointer-events: all;
  }

  @media (max-width: ${TOAST_WIDTH_PX + 40}px) {
    width: calc(100% - 32px);
  }
`;
