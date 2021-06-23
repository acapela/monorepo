import { endOfDay, startOfDay } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import { setColorOpacity } from "~frontend/../../shared/colors";
import { niceFormatDateTime } from "~frontend/../../shared/dates/format";
import { useBoolean } from "~frontend/../../shared/hooks/useBoolean";
import { GoogleCalendarEvent } from "~frontend/../../shared/types/googleCalendar";
import { PopPresenceAnimator } from "~frontend/../../ui/animations";
import { borderRadius } from "~frontend/../../ui/baseStyles";
import { Button } from "~frontend/../../ui/buttons/Button";
import { PRIMARY_COLOR } from "~frontend/../../ui/colors";
import { ItemTitle, SecondaryText, TextTitle } from "~frontend/../../ui/typo";
import { googleCalendarEventsApi } from "~frontend/requests/googleCalendar";
import { Modal } from "~frontend/ui/Modal";
import { CreateRoomForm } from "../HomeView/CreateRoom/CreateRoomForm";

interface Props {
  event: GoogleCalendarEvent;
  className?: string;
}

export const GoogleCalendarEventsCard = styled(function GoogleCalendarEventsCard({ event, className }: Props) {
  const [isCreatingRoom, { set: openCreatingRoomModal, unset: closeCreatingRoomModal }] = useBoolean(false);

  return (
    <>
      <UIHolder layout="position" className={className}>
        <UIInfo>
          <UIName>{event.title}</UIName>
          {event.startTime && <UIDate>{niceFormatDateTime(event.startTime)}</UIDate>}
        </UIInfo>
        <UIActions>
          <Button onClick={openCreatingRoomModal}>Create Room</Button>
        </UIActions>
      </UIHolder>
      <AnimatePresence>
        {isCreatingRoom && (
          <Modal onCloseRequest={closeCreatingRoomModal}>
            <CreateRoomForm
              onCancel={closeCreatingRoomModal}
              initialRoomName={event.title}
              initialDeadline={event.startTime}
            />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
})``;

const UIHolder = styled(PopPresenceAnimator)`
  display: flex;
  align-items: center;
  position: relative;
  padding: 1rem;
  background-color: ${setColorOpacity(PRIMARY_COLOR, 0.2)};
  ${borderRadius.card};
`;

const UIInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const UIName = styled(SecondaryText)`
  margin-bottom: 8px;
  font-weight: bold;
`;

const UIDate = styled(SecondaryText)``;

const UIActions = styled.div``;
