import React, { useRef } from "react";
import styled, { css } from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { updateRoom, useIsCurrentUserRoomMember } from "~frontend/gql/rooms";
import { getRoomManagePopoverOptions, handleToggleCloseRoom } from "~frontend/rooms/editOptions";
import { RoomStoreContext } from "~frontend/rooms/RoomStore";
import { CircleOptionsButton } from "~frontend/ui/options/OptionsButton";
import { PageMeta } from "~frontend/utils/PageMeta";
import { RoomDetailedInfoFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Button } from "~ui/buttons/Button";
import { CardBase } from "~ui/card/Base";
import { CollapsePanel } from "~ui/collapse/CollapsePanel";
import { EditableText } from "~ui/forms/EditableText";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { GoogleCalendarIcon } from "~ui/social/GoogleCalendarIcon";
import { PrivateTag } from "~ui/tags";
import { TextH4 } from "~ui/typo";

import { RoomSidebarInfo } from "./RoomSidebarInfo";
import { TopicsList } from "./TopicsList";

interface Props {
  room: RoomDetailedInfoFragment;
  selectedTopicId: string | null;
  children: React.ReactNode;
}

export function RoomView(props: Props) {
  return (
    // Re-create context if re-rendered for a different room
    <RoomStoreContext key={props.room.id}>
      <RoomViewDisplayer {...props} />
    </RoomStoreContext>
  );
}

function RoomViewDisplayer({ room, selectedTopicId, children }: Props) {
  const titleHolderRef = useRef<HTMLDivElement>(null);
  const [isEditingRoomName, { set: enterNameEditMode, unset: exitNameEditMode }] = useBoolean(false);
  const amIMember = useIsCurrentUserRoomMember(room ?? undefined);

  const isRoomOpen = !room.finished_at;

  async function handleRoomNameChange(newName: string) {
    const oldRoomName = room.name;
    await updateRoom({ roomId: room.id, input: { name: newName } });
    trackEvent("Renamed Room", { roomId: room.id, newRoomName: newName, oldRoomName });
  }

  async function handleCloseRoomClick() {
    await handleToggleCloseRoom(room);
  }

  return (
    <>
      <PageMeta title={room.name} />
      <UIHolder>
        <UISidebar>
          <CollapsePanel
            persistanceKey={`room-info-${room.id}`}
            isInitiallyOpen
            headerNode={
              <UIRoomHead spezia semibold>
                <UIRoomTitle ref={titleHolderRef}>
                  <EditableText
                    value={room.name ?? ""}
                    onValueSubmit={handleRoomNameChange}
                    isInEditMode={isEditingRoomName}
                    onEditModeRequest={enterNameEditMode}
                    onExitEditModeChangeRequest={exitNameEditMode}
                  />

                  <UIRoomTags>
                    {room.is_private && <PrivateTag tooltipLabel="Room is only visible to participants" />}

                    {room.source_google_calendar_event_id && (
                      <GoogleCalendarIcon data-tooltip="Connected to Google Calendar event" />
                    )}
                  </UIRoomTags>
                </UIRoomTitle>

                {amIMember && (
                  <PopoverMenuTrigger
                    options={getRoomManagePopoverOptions(room, {
                      onEditRoomNameRequest: () => enterNameEditMode(),
                    })}
                  >
                    <CircleOptionsButton />
                  </PopoverMenuTrigger>
                )}
              </UIRoomHead>
            }
          >
            <RoomSidebarInfo room={room} />
          </CollapsePanel>

          <UITopicsCard>
            <TopicsList room={room} activeTopicId={selectedTopicId} isRoomOpen={isRoomOpen} />
          </UITopicsCard>
          <CloseRoomButton onClick={handleCloseRoomClick}>Close Room</CloseRoomButton>
        </UISidebar>

        <UIContentHolder>{children}</UIContentHolder>
      </UIHolder>
    </>
  );
}

const UIHolder = styled.div<{}>`
  display: grid;
  grid-template-columns: 400px 1fr;
  width: 100%;
  flex-grow: 1;
  min-height: 0;
`;

const UISidebar = styled.div<{}>`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
  gap: 24px;
  padding: 32px;
`;

const UIContentHolder = styled.div<{}>`
  flex-grow: 1;
  min-height: 0;
  min-width: 0;
`;

const UIRoomHead = styled(TextH4)<{}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UIRoomTitle = styled.div<{}>`
  padding-right: 16px;
  display: flex;
  ${(props) =>
    props.onClick &&
    css`
      cursor: pointer;
    `}
`;

const UIRoomTags = styled.div<{}>`
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseRoomButton = styled(Button)`
  align-self: center;
`;

const UITopicsCard = styled(CardBase)`
  min-height: 0;
  display: flex;
  flex-direction: column;
`;
