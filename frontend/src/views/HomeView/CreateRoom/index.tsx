import React from "react";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Button } from "~ui/buttons/Button";
import { Modal } from "~frontend/ui/Modal";
import { Form } from "./Form";
import { IconPlus } from "~ui/icons/default";

export const CreateRoom = () => {
  const [isModalVisible, { toggle: toggleModalVisibility }] = useBoolean(false);

  return (
    <>
      <Button iconPosition="start" icon={<IconPlus />} isRounded onClick={toggleModalVisibility}>
        Create a new Room
      </Button>
      {isModalVisible && (
        <Modal onCloseRequest={toggleModalVisibility}>
          <Form onCancel={toggleModalVisibility} />
        </Modal>
      )}
    </>
  );
};
