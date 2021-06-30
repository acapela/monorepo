import styled from "styled-components";
import { BodyPortal } from "~ui/BodyPortal";
import { useToasts, removeToast } from "./data";
import { ToastLabel } from "./ToastLabel";
import { AnimatePresence } from "framer-motion";
import { getObjectKey } from "~shared/object";
import { zIndex } from "~ui/zIndex";

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

const UIFlyer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: ${zIndex.Toast};
`;

const UIToastsHolder = styled.div`
  max-width: 360px;
  display: flex;
  flex-direction: column-reverse;

  ${ToastLabel} {
    margin-top: 8px;
  }
`;
