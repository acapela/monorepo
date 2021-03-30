import React from "react";
import styled from "styled-components";
import { DialogContent, DialogOverlay } from "@reach/dialog";
import { AnimatePresence, motion } from "framer-motion";

const MotionDialogOverlay = motion(DialogOverlay);

const UIDialogContent = styled(motion.div)`
  border-radius: 0.5rem;
`;

const UIRoomCreationDialogTitle = styled.h1`
  font-size: 1.875rem;
  line-height: 2.25rem;
  margin-bottom: 2rem;
`;

export const Dialog = ({
  title,
  open,
  onClose,
  children,
  ...rest
}: {
  title: string;
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
              <UIDialogContent>
                <UIRoomCreationDialogTitle>{title}</UIRoomCreationDialogTitle>
                {children}
              </UIDialogContent>
            </DialogContent>
          </motion.div>
        </MotionDialogOverlay>
      )}
    </AnimatePresence>
  );
};
