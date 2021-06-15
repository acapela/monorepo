import React, { useState } from "react";
import styled from "styled-components";
import { validate } from "./validate";
import { Button } from "~ui/buttons/Button";
import { handleWithPreventDefault } from "~shared/events";
import { useSpacesQuery } from "~frontend/gql/spaces";
import { useAssertCurrentTeamId } from "~frontend/authentication/useCurrentUser";
import { SpacesCombobox } from "./SpacesCombobox";
import { SpaceNameInput } from "./SpaceNameInput";
interface Props {
  onCancel: () => void;
}

export const Form = ({ onCancel }: Props) => {
  const [roomName, setRoomName] = useState<string>("");
  const [spaceId, setSpaceId] = useState<string | null>(null);
  const [spaceName, setSpaceName] = useState<string>("");

  const teamId = useAssertCurrentTeamId();
  const [spacesList = []] = useSpacesQuery({ teamId });

  const validationError = validate({
    roomName,
    spaceName,
    spaceId,
  });

  const isSubmitDisabled = Boolean(validationError);
  const handleSubmit = () => {
    if (isSubmitDisabled) {
      return;
    }
    console.log({
      roomName,
      spaceName,
      spaceId,
    });
  };

  return (
    <UIForm onSubmit={handleWithPreventDefault(handleSubmit)}>
      <UIRoomNameInput
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        autoFocus
        placeholder="Room name"
      />
      {spacesList.length > 0 ? (
        <SpacesCombobox items={spacesList} onSelect={setSpaceId} />
      ) : (
        <SpaceNameInput value={spaceName} onChange={setSpaceName} />
      )}
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
