import React from "react";
import styled from "styled-components";
import { DialogContent, DialogOverlay } from "@reach/dialog";
import { AnimatePresence, motion } from "framer-motion";

const MotionDialogOverlay = motion(DialogOverlay);

const UIDialogContent = styled(motion.div)`
  border-radius: 0.5rem;
`;

export const Dialog = ({
  open,
  onClose,
  children,
  ...rest
}: {
  open?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}) => {
  return (
    <AnimatePresence>
      {open && (
        <MotionDialogOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onDismiss={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: "-50%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-50%" }}
          >
            <DialogContent {...rest}>
              <UIDialogContent>{children}</UIDialogContent>
            </DialogContent>
          </motion.div>
        </MotionDialogOverlay>
      )}
    </AnimatePresence>
  );
};
