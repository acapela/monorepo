import React, { useState } from "react";
import styled from "styled-components";
import { validate } from "./validate";
import { Button } from "~ui/buttons/Button";

interface Props {
  onCancel: () => void;
}

export const Form = ({ onCancel }: Props) => {
  const [roomName, setRoomName] = useState<string>("");

  const validationError = validate({
    roomName,
  });

  const isSubmitDisabled = Boolean(validationError);
  console.log(validationError, isSubmitDisabled);
  const handleSubmit = () => {
    if (isSubmitDisabled) {
      return;
    }
    console.log({
      roomName,
    });
  };

  return (
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
        <Button isDisabled={isSubmitDisabled} kind="ghost" isRounded type="reset" onClick={onCancel}>
          Cancel
        </Button>
        <Button isRounded onClick={() => null}>
          Create
        </Button>
      </UIButtons>
    </UIForm>
  );
};

const UIForm = styled.form`
  display: grid;
  grid-template-columns: 320px;
  align-items: center;
  gap: 36px;
`;

const UIRoomNameInput = styled.input`
  text-align: center;
  font-size: 24px;

  outline: none;

  ::placeholder {
    color: #b4b4b4;
  }
`;

const UIButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 124px);
  gap: 20px;
  justify-content: center;
`;
