import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { validateRoomCreationInfo } from "./validateRoomCreationInfo";
import { Button } from "~ui/buttons/Button";
import { OutlinedButton } from "~ui/buttons/OutlinedButton";
import { handleWithPreventDefault } from "~shared/events";
import { useCurrentTeamSpaces } from "~frontend/gql/spaces";
import { useAssertCurrentTeamId } from "~frontend/authentication/useCurrentUser";
import { SpacesCombobox } from "./SpacesCombobox";
import { SpaceNameInput } from "./SpaceNameInput";
import { FieldLabel } from "~ui/typo";
import { UIFormField } from "./UIFormField";
import { useCreateSpaceMutation } from "~frontend/gql/spaces";
import { slugify } from "~shared/slugify";
import { InputError } from "~ui/forms/InputError";
import { getRoomDefaultDeadline } from "~frontend/utils/room";
import { DateTimeInput } from "~ui/time/DateTimeInput";
import { createPromiseUI } from "~ui/createPromiseUI";
import { Modal } from "~frontend/ui/Modal";

interface RoomInputInitialData {
  name?: string;
  deadline?: Date;
  spaceId?: string;
}

interface RoomInputOutputData {
  name: string;
  deadline: Date;
  spaceId: string;
  slug: string;
}

export const openRoomInputPrompt = createPromiseUI<RoomInputInitialData, RoomInputOutputData | null>(
  (
    { name: initialRoomName = "", deadline: initialDeadline = getRoomDefaultDeadline(), spaceId: initialSpaceId },
    resolve
  ) => {
    const [createSpace, { loading: createSpaceLoading }] = useCreateSpaceMutation();

    const [roomName, setRoomName] = useState<string>(initialRoomName);
    const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(initialSpaceId ?? null);
    const [spaceName, setSpaceName] = useState<string>("");
    const [deadline, setDeadline] = useState<Date>(initialDeadline);

    const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

    const teamId = useAssertCurrentTeamId();
    const [spacesList = []] = useCurrentTeamSpaces();

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
          resolve({ deadline, name: roomName, spaceId, slug: slugify(roomName) });
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
      <Modal onCloseRequest={() => resolve(null)}>
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
              <OutlinedButton type="reset" onClick={() => resolve(null)}>
                Cancel
              </OutlinedButton>
              <Button isLoading={createSpaceLoading} onClick={() => null}>
                Create
              </Button>
            </UIButtons>
          </UIBottomArea>
        </UIForm>
      </Modal>
    );
  }
);

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
