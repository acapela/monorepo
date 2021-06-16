import React, { useState } from "react";
import styled from "styled-components";
import { add, roundToNearestMinutes } from "date-fns";
import { validate } from "./validate";
import { Button } from "~ui/buttons/Button";
import { handleWithPreventDefault } from "~shared/events";
import { useSpacesQuery } from "~frontend/gql/spaces";
import { useAssertCurrentTeamId } from "~frontend/authentication/useCurrentUser";
import { SpacesCombobox } from "./SpacesCombobox";
import { SpaceNameInput } from "./SpaceNameInput";
import { DateTimeInput } from "~frontend/ui/DateTimeInput";
import { FieldLabel } from "~ui/typo";
import { UIFormField } from "./UIFormField";
import { useCreateSpaceMutation } from "~frontend/gql/spaces";
import { slugify } from "~shared/slugify";
import { useCreateRoomMutation } from "~frontend/gql/rooms";
import { routes } from "~frontend/routes";

interface Props {
  onCancel: () => void;
}

const getDefaultDueDate = () => {
  const date = add(new Date(), { days: 1 });
  return roundToNearestMinutes(date, { nearestTo: 15 });
};

export const Form = ({ onCancel }: Props) => {
  const [createSpace, { loading: createSpaceLoading }] = useCreateSpaceMutation();
  const [createRoom, { loading: createRoomLoading }] = useCreateRoomMutation();

  const [roomName, setRoomName] = useState<string>("");
  const [spaceId, setSpaceId] = useState<string | null>(null);
  const [spaceName, setSpaceName] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date>(getDefaultDueDate);

  const teamId = useAssertCurrentTeamId();
  const [spacesList = []] = useSpacesQuery({ teamId });

  const validationError = validate({
    roomName,
    spaceName,
    spaceId: spaceId,
  });

  const isSubmitDisabled = Boolean(validationError);
  const isSubmitLoading = createSpaceLoading || createRoomLoading;

  const handleSubmit = async () => {
    if (isSubmitDisabled) {
      return;
    }

    let finalSpaceId = spaceId;
    if (!finalSpaceId) {
      const [space] = await createSpace({ name: spaceName, teamId, slug: slugify(spaceName) });
      if (space) {
        finalSpaceId = space.id;
      }
    }

    if (!finalSpaceId) {
      return;
    }

    const [room] = await createRoom({ name: roomName, spaceId: finalSpaceId, slug: slugify(roomName) });

    if (!room) {
      return;
    }

    routes.spaceRoom.push({ spaceId: finalSpaceId, roomId: room.id });
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
        <SpacesCombobox items={spacesList} onChange={setSpaceId} />
      ) : (
        <SpaceNameInput value={spaceName} onChange={setSpaceName} />
      )}
      <UIFormField>
        <FieldLabel>Due date</FieldLabel>
        <DateTimeInput value={dueDate} onChange={setDueDate} />
      </UIFormField>
      <UIButtons>
        <Button kind="ghost" isRounded type="reset" onClick={onCancel}>
          Cancel
        </Button>
        <Button isLoading={isSubmitLoading} isDisabled={isSubmitDisabled} isRounded onClick={() => null}>
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
