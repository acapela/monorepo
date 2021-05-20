import { DialogContent, DialogOverlay } from "@reach/dialog";
import { AnimatePresence, motion } from "framer-motion";
import React, { ReactNode } from "react";
import styled from "styled-components";

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
  isOpened,
  onClose,
  children,
  ...rest
}: {
  title: string;
  isOpened?: boolean;
  onClose?: () => void;
  children?: ReactNode;
}) => {
  return (
    <AnimatePresence>
      {isOpened && (
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
