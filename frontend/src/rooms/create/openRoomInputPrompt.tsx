import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FieldWithName } from "~ui/forms/FieldWithName";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { Modal } from "~frontend/ui/Modal";
import { getRoomDefaultDeadline } from "~frontend/utils/room";
import { handleWithPreventDefault } from "~shared/events";
import { slugify } from "~shared/slugify";
import { Button } from "~ui/buttons/Button";
import { OutlinedButton } from "~ui/buttons/OutlinedButton";
import { createPromiseUI } from "~ui/createPromiseUI";
import { InputError } from "~ui/forms/InputError";
import { DateTimeInput } from "~ui/time/DateTimeInput";
import { TextInput } from "~ui/forms/TextInput";
import { SpacePicker } from "~frontend/ui/spaces/SpacePicker";
import { TeamMembersPicker } from "./TeamMembersPicker";
import { validateRoomCreationInfo } from "./validateRoomCreationInfo";
import { IconCommentText } from "~frontend/../../ui/icons";
import { AnimatePresence, AnimateSharedLayout } from "framer-motion";

interface RoomInputInitialData {
  name?: string;
  deadline?: Date;
  spaceId?: string;
  participantsIds?: string[];
}

interface RoomInputOutputData {
  name: string;
  deadline: Date;
  spaceId: string;
  slug: string;
  participantsIds: string[];
}

export const openRoomInputPrompt = createPromiseUI<RoomInputInitialData, RoomInputOutputData | null>(
  (
    {
      name: initialRoomName = "",
      deadline: initialDeadline = getRoomDefaultDeadline(),
      spaceId: initialSpaceId,
      participantsIds: initialParticipantsIds = [],
    },
    resolve
  ) => {
    const currentUser = useAssertCurrentUser();
    const [roomName, setRoomName] = useState<string>(initialRoomName);
    const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(initialSpaceId ?? null);
    const [deadline, setDeadline] = useState<Date>(initialDeadline);
    const [participantIds, setParticipantIds] = useState<string[]>(
      ensureCurrentUserInParticipants(initialParticipantsIds)
    );

    const participantIdsWithCurrentUser = ensureCurrentUserInParticipants(participantIds);

    const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

    function ensureCurrentUserInParticipants(userIds: string[]): string[] {
      if (userIds.includes(currentUser.id)) return userIds;

      return [currentUser.id, ...userIds];
    }

    // clear the error on changes in the form values
    useEffect(() => {
      setFormErrorMessage(null);
    }, [roomName, selectedSpaceId]);

    const validationErrorMessage = validateRoomCreationInfo({
      roomName,
      spaceId: selectedSpaceId,
    });

    const handleSubmit = async () => {
      const errorMessage = formErrorMessage || validationErrorMessage;
      if (typeof errorMessage === "string") {
        setFormErrorMessage(errorMessage);
        return;
      }

      if (!selectedSpaceId) {
        return;
      }

      try {
        try {
          resolve({
            deadline,
            name: roomName,
            spaceId: selectedSpaceId,
            slug: slugify(roomName),
            participantsIds: participantIdsWithCurrentUser,
          });
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
            <AnimateSharedLayout>
              <TextInput
                icon={<IconCommentText />}
                value={roomName}
                onChangeText={setRoomName}
                autoFocus
                placeholder="Room name"
              />
            </AnimateSharedLayout>
            <SpacePicker selectedSpaceId={selectedSpaceId} onChange={setSelectedSpaceId} />

            <TeamMembersPicker selectedMemberIds={participantIdsWithCurrentUser} onChange={setParticipantIds} />

            <DateTimeInput value={deadline} onChange={setDeadline} label="Set a due date" />
          </UIFormFields>
          <UIBottomArea>
            {formErrorMessage ? <InputError message={formErrorMessage} /> : <div />}
            <UIButtons>
              <OutlinedButton type="reset" onClick={() => resolve(null)}>
                Cancel
              </OutlinedButton>
              <Button onClick={() => null}>Create</Button>
            </UIButtons>
          </UIBottomArea>
        </UIForm>
      </Modal>
    );
  }
);

const UIForm = styled.form`
  display: grid;
  align-items: center;
  gap: 60px;
  min-width: 520px;
  max-width: 520px;
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
