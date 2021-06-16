import React, { useEffect, useState } from "react";
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
import { InputError } from "~frontend/../../ui/forms/InputError";

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
  const [spaceId, setSpaceId] = useState<string>();
  const [spaceName, setSpaceName] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date>(getDefaultDueDate);

  const [formErrorMessage, setFormErrorMessage] = useState<string>();

  const teamId = useAssertCurrentTeamId();
  const [spacesList = []] = useSpacesQuery({ teamId });

  useEffect(() => {
    if (!spaceId && spacesList.length === 1) {
      setSpaceId(spacesList[0].id);
    }
  }, [spacesList, spaceId]);

  useEffect(() => {
    setFormErrorMessage(undefined);
  }, [roomName, spaceId, spaceName]);

  const validationErrorMessage = validate({
    roomName,
    spaceName,
    spaceId,
  });

  const isSubmitLoading = createSpaceLoading || createRoomLoading;

  const handleSubmit = async () => {
    const errorMessage = formErrorMessage || validationErrorMessage;
    if (errorMessage) {
      setFormErrorMessage(errorMessage);
      return;
    }

    try {
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

      try {
        const [room] = await createRoom({ name: roomName, spaceId: finalSpaceId, slug: slugify(roomName) });
        if (!room) {
          return;
        }

        routes.spaceRoom.push({ spaceId: finalSpaceId, roomId: room.id });
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
          <SpacesCombobox itemId={spaceId} items={spacesList} onChange={setSpaceId} />
        ) : (
          <SpaceNameInput value={spaceName} onChange={setSpaceName} />
        )}
        <UIFormField>
          <FieldLabel>Due date</FieldLabel>
          <DateTimeInput value={dueDate} onChange={setDueDate} />
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
`;

const UIButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 124px);
  gap: 20px;
  justify-content: center;
`;
