import React from "react";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Button } from "~ui/buttons/Button";
import { Modal } from "~frontend/ui/Modal";
import { CreateRoomForm } from "./CreateRoomForm";
import { IconPlus } from "~ui/icons/default";
import { AnimatePresence } from "framer-motion";

export const CreateRoomButton = () => {
  const [isModalVisible, { toggle: toggleModalVisibility }] = useBoolean(false);

  return (
    <>
      <Button iconPosition="start" icon={<IconPlus />} onClick={toggleModalVisibility}>
        Create a new Room
      </Button>
      <AnimatePresence>
        {isModalVisible && (
          <Modal onCloseRequest={toggleModalVisibility}>
            <CreateRoomForm onCancel={toggleModalVisibility} />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};
