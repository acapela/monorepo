import { DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";
import { AnimatePresence, motion } from "framer-motion";

const MotionDialogOverlay = motion.custom(DialogOverlay);

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
            <DialogContent className="rounded-lg" {...rest}>
              {children}
            </DialogContent>
          </motion.div>
        </MotionDialogOverlay>
      )}
    </AnimatePresence>
  );
};
