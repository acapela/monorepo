import React, { useState } from "react";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Button } from "~ui/buttons/Button";
import { Modal } from "~frontend/ui/Modal";
import styled from "styled-components";
import { validate } from "./validate";

export const CreateRoom = () => {
  const [roomName, setRoomName] = useState<string>("");
  const [isModalVisible, { toggle: toggleModalVisibility }] = useBoolean(false);

  const validationError = validate({
    roomName,
  });

  const isSubmitEnabled = !validationError;

  const handleSubmit = () => {
    console.log({
      roomName,
    });
  };

  return (
    <>
      <Button onClick={toggleModalVisibility}>Create a new room</Button>
      {isModalVisible && (
        <Modal onCloseRequest={toggleModalVisibility}>
          <UIForm
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <UIRoomNameInput
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              autoFocus
              placeholder="Room name"
            />
            <UIButtons>
              <Button kind="ghost" isRounded type="reset" onClick={toggleModalVisibility}>
                Cancel
              </Button>
              <Button isRounded onClick={() => null}>
                Create
              </Button>
            </UIButtons>
          </UIForm>
        </Modal>
      )}
    </>
  );
};

const UIForm = styled.form`
  display: grid;
  grid-template-columns: 320px;
  align-items: center;
  gap: 36px;
`;

const UIRoomNameInput = styled.input`
  /* background: transparent; */
  text-align: center;
  font-size: 24px;

  outline: none;

  ::placeholder {
    color: #b4b4b4;
  }
`;

const UIButtons = styled.div`
  display: grid;
  grid-template-columns: 124px 124px;
  gap: 20px;
  justify-content: center;
`;
