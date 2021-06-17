import React from "react";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Button } from "~ui/buttons/Button";
import { Modal } from "~frontend/ui/Modal";
import { CreateRoomForm } from "./CreateRoomForm";
import { IconPlus } from "~ui/icons/default";

export const CreateRoomButton = () => {
  const [isModalVisible, { toggle: toggleModalVisibility }] = useBoolean(false);

  return (
    <>
      <Button iconPosition="start" icon={<IconPlus />} isRounded onClick={toggleModalVisibility}>
        Create a new Room
      </Button>
      {isModalVisible && (
        <Modal onCloseRequest={toggleModalVisibility}>
          <CreateRoomForm onCancel={toggleModalVisibility} />
        </Modal>
      )}
    </>
  );
};
