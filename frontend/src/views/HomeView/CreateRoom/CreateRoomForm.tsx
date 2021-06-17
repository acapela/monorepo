import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { validateRoomCreationInfo } from "./validateRoomCreationInfo";
import { Button } from "~ui/buttons/Button";
import { handleWithPreventDefault } from "~shared/events";
import { useSpacesQuery } from "~frontend/gql/spaces";
import { useAssertCurrentTeamId } from "~frontend/authentication/useCurrentUser";
import { SpacesCombobox } from "./SpacesCombobox";
import { SpaceNameInput } from "./SpaceNameInput";
import { FieldLabel } from "~ui/typo";
import { UIFormField } from "./UIFormField";
import { useCreateSpaceMutation } from "~frontend/gql/spaces";
import { slugify } from "~shared/slugify";
import { useCreateRoomMutation } from "~frontend/gql/rooms";
import { routes } from "~frontend/routes";
import { InputError } from "~ui/forms/InputError";
import { getRoomDefaultDeadline } from "~frontend/utils/room";
import { DateTimeInput } from "~ui/time/DateTimeInput";

interface Props {
  onCancel: () => void;
}

export const CreateRoomForm = ({ onCancel }: Props) => {
  const [createSpace, { loading: createSpaceLoading }] = useCreateSpaceMutation();
  const [createRoom, { loading: createRoomLoading }] = useCreateRoomMutation();

  const [roomName, setRoomName] = useState<string>("");
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [spaceName, setSpaceName] = useState<string>("");
  const [deadline, setDeadline] = useState<Date>(getRoomDefaultDeadline);

  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

  const teamId = useAssertCurrentTeamId();
  const [spacesList = []] = useSpacesQuery({ teamId });

  // if only one space - make it selected by default
  useEffect(() => {
    if (!selectedSpaceId && spacesList.length === 1) {
      setSelectedSpaceId(spacesList[0].id);
    }
  }, [spacesList, selectedSpaceId]);

  // clear the error on changes in the form values
  useEffect(() => {
    setFormErrorMessage(null);
  }, [roomName, selectedSpaceId, spaceName]);

  const validationErrorMessage = validateRoomCreationInfo({
    roomName,
    spaceName,
    spaceId: selectedSpaceId,
  });

  const isSubmitLoading = createSpaceLoading || createRoomLoading;

  const handleSubmit = async () => {
    const errorMessage = formErrorMessage || validationErrorMessage;
    if (errorMessage) {
      setFormErrorMessage(errorMessage);
      return;
    }

    try {
      let spaceId = selectedSpaceId;
      if (spacesList.length === 0) {
        const [space] = await createSpace({ name: spaceName, teamId, slug: slugify(spaceName) });
        if (space) {
          spaceId = space.id;
        }
      }

      if (!spaceId) {
        return;
      }

      try {
        const [room] = await createRoom({ name: roomName, deadline, spaceId, slug: slugify(roomName) });
        if (!room) {
          return;
        }

        routes.spaceRoom.push({ spaceId, roomId: room.id });
      } catch (err) {
        if (err.message.includes("Uniqueness violation")) {
          setFormErrorMessage("Room with this name already exists");
        } else {
          throw err;
        }
      }
    } catch (err) {
      setFormErrorMessage("Oops something went wrong");
    }
  };

  return (
    <UIForm onSubmit={handleWithPreventDefault(handleSubmit)}>
      <UIFormFields>
        <UIRoomNameInput
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          autoFocus
          placeholder="Room name"
        />
        {spacesList.length > 0 ? (
          <SpacesCombobox itemId={selectedSpaceId} items={spacesList} onChange={setSelectedSpaceId} />
        ) : (
          <SpaceNameInput value={spaceName} onChange={setSpaceName} />
        )}
        <UIFormField>
          <FieldLabel>Due date</FieldLabel>
          <DateTimeInput value={deadline} onChange={setDeadline} />
        </UIFormField>
      </UIFormFields>
      <UIBottomArea>
        {formErrorMessage ? <InputError message={formErrorMessage} /> : <div />}
        <UIButtons>
          <Button kind="ghost" isRounded type="reset" onClick={onCancel}>
            Cancel
          </Button>
          <Button isLoading={isSubmitLoading} isRounded onClick={() => null}>
            Create
          </Button>
        </UIButtons>
      </UIBottomArea>
    </UIForm>
  );
};

const UIForm = styled.form`
  display: grid;
  grid-template-columns: 320px;
  align-items: center;
  gap: 60px;
`;

const UIFormFields = styled.div`
  display: grid;
  grid-template-columns: 1fr;
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

const UIBottomArea = styled.div`
  display: grid;
  grid-template-rows: 20px auto;
  gap: 10px;
  justify-items: center;
`;

const UIButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 124px);
  gap: 20px;
  justify-content: center;
`;
