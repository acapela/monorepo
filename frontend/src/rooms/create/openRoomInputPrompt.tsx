import { AnimateSharedLayout } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { Modal } from "~frontend/ui/Modal";
import { SpacePicker } from "~frontend/ui/spaces/SpacePicker";
import { getRoomDefaultDeadline } from "~frontend/utils/room";
import { Button } from "~ui/buttons/Button";
import { createPromiseUI } from "~ui/createPromiseUI";
import { InputError } from "~ui/forms/InputError";
import { TextInput } from "~ui/forms/TextInput";
import { IconCommentText } from "~ui/icons";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { DateTimeInput } from "~ui/time/DateTimeInput";

import { RecurrancePicker, RecurringDays } from "./RecurrancePicker";
import { TeamMembersPicker } from "./TeamMembersPicker";
import { validateRoomCreationInfo } from "./validateRoomCreationInfo";

interface RoomInputInitialData {
  name?: string;
  deadline?: Date;
  spaceId?: string;
  hideSpaceInput?: boolean;
  participantsIds?: string[];
  recurringDays?: RecurringDays;
}

interface RoomInputOutputData {
  name: string;
  deadline: Date;
  spaceId: string;
  participantsIds: string[];
  recurringDays: RecurringDays;
}

export const openRoomInputPrompt = createPromiseUI<RoomInputInitialData, RoomInputOutputData | null>(
  (
    {
      name: initialRoomName = "",
      deadline: initialDeadline = getRoomDefaultDeadline(),
      spaceId: initialSpaceId,
      participantsIds: initialParticipantsIds = [],
      recurringDays: initialRecurringDays = null,
      hideSpaceInput,
    },
    resolve
  ) => {
    const currentUser = useAssertCurrentUser();
    const [roomName, setRoomName] = useState<string>(initialRoomName);
    const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(initialSpaceId ?? null);
    const [deadline, setDeadline] = useState<Date>(initialDeadline);
    const [recurringDays, setRecurringDays] = useState<RecurringDays>(initialRecurringDays);
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
            participantsIds: participantIdsWithCurrentUser,
            recurringDays,
          });
        } catch (err) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((err as any)?.message?.includes("Uniqueness violation")) {
            setFormErrorMessage("Room with this name already exists");
          } else {
            throw err;
          }
        }
      } catch (err) {
        setFormErrorMessage("Oops something went wrong");
      }
    };

    useShortcut("Enter", () => {
      handleSubmit();
    });

    return (
      <Modal onCloseRequest={() => resolve(null)} head={{ title: "Create room" }}>
        <UIHolder>
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
            {!hideSpaceInput && <SpacePicker selectedSpaceId={selectedSpaceId} onChange={setSelectedSpaceId} />}

            <TeamMembersPicker selectedMemberIds={participantIdsWithCurrentUser} onChange={setParticipantIds} />

            <DateTimeInput shouldSkipConfirmation value={deadline} onChange={setDeadline} label="Set a due date" />

            <RecurrancePicker recurringDays={recurringDays} onChange={setRecurringDays} />
          </UIFormFields>
          <UIBottomArea>
            {formErrorMessage ? <InputError message={formErrorMessage} /> : <div />}
            <UIButtons>
              <Button kind="transparent" type="reset" onClick={() => resolve(null)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Create</Button>
            </UIButtons>
          </UIBottomArea>
        </UIHolder>
      </Modal>
    );
  }
);

const UIHolder = styled.div<{}>`
  display: grid;
  align-items: center;
  gap: 60px;
  min-width: 520px;
  max-width: 520px;
`;

const UIFormFields = styled.div<{}>`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const UIBottomArea = styled.div<{}>`
  display: grid;
  grid-template-rows: 20px auto;
  gap: 10px;
  justify-items: center;
`;

const UIButtons = styled.div<{}>`
  display: grid;
  grid-template-columns: repeat(2, 124px);
  gap: 20px;
  justify-content: center;
`;
