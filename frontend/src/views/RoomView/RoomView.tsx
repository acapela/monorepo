import { gql } from "@apollo/client";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled, { css } from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { clientdb } from "~frontend/clientdb";
import { useIsCurrentUserRoomMember } from "~frontend/gql/rooms";
import { withFragments } from "~frontend/gql/utils";
import { RoomStoreContext } from "~frontend/rooms/RoomStore";
import { CircleOptionsButton } from "~frontend/ui/options/OptionsButton";
import { PageMeta } from "~frontend/utils/PageMeta";
import { getPopoverEditMenuOptions } from "~frontend/views/RoomView/editOptions";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Button } from "~ui/buttons/Button";
import { CardBase } from "~ui/card/Base";
import { CollapsePanel } from "~ui/collapse/CollapsePanel";
import { EditableText } from "~ui/forms/EditableText";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { GoogleCalendarIcon } from "~ui/social/GoogleCalendarIcon";
import { PrivateTag, Tag } from "~ui/tags";
import { TextH4 } from "~ui/typo";

import { closeOpenTopicsPrompt } from "./RoomCloseModal";
import { RoomSidebarInfo } from "./RoomSidebarInfo";
import { TopicsList } from "./TopicsList";

interface Props {
  roomId: string;
  selectedTopicId: string | null;
  children: React.ReactNode;
}

export const RoomView = observer(function RoomView(props: Props) {
  return (
    // Re-create context if re-rendered for a different room
    <RoomStoreContext key={props.roomId}>
      <RoomViewDisplayer {...props} />
    </RoomStoreContext>
  );
});

const RoomViewDisplayer = observer(function RoomViewDisplayer({ roomId, selectedTopicId, children }: Props) {
  const room = clientdb.room.findById(roomId);

  const titleHolderRef = useRef<HTMLDivElement>(null);
  const [isEditingRoomName, { set: enterNameEditMode, unset: exitNameEditMode }] = useBoolean(false);
  // const amIMember = useIsCurrentUserRoomMember(room);
  const amIMember = true;

  if (!room) return <div>no room</div>;

  const editOptions = getPopoverEditMenuOptions({
    room,
    onEditRoomNameRequest: () => enterNameEditMode(),
    onCloseRoom: handleCloseRoom,
  });

  async function handleCloseRoom() {
    if (!room) return;

    if (room.finished_at) {
      room.update({ finished_at: null });
      trackEvent("Reopened Room", { roomId });
      return;
    }
    const openTopics = room.topics.all.filter((topic) => !topic.closed_at);

    if (openTopics.length > 0) {
      const canCloseRoom = await closeOpenTopicsPrompt(room);
      if (!canCloseRoom) {
        return;
      }
    }

    room.update({ finished_at: new Date().toISOString() });

    trackEvent("Closed Room", { roomId, hasRoomOpenTopics: openTopics.length > 0 });
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
                    onValueSubmit={(name) => {
                      room.update({ name });
                    }}
                    isInEditMode={isEditingRoomName}
                    onEditModeRequest={enterNameEditMode}
                    onExitEditModeChangeRequest={exitNameEditMode}
                  />

                  <UIRoomTags>
                    {room.is_private && <PrivateTag tooltipLabel="Room is only visible to participants" />}
                    {room.isRecurring && <Tag kind="shareInformation">Recurring</Tag>}

                    {room.source_google_calendar_event_id && (
                      <GoogleCalendarIcon data-tooltip="Connected to Google Calendar event" />
                    )}
                  </UIRoomTags>
                </UIRoomTitle>

                {amIMember && (
                  <PopoverMenuTrigger options={editOptions}>
                    <CircleOptionsButton />
                  </PopoverMenuTrigger>
                )}
              </UIRoomHead>
            }
          >
            <RoomSidebarInfo room={room} />
          </CollapsePanel>

          <UITopicsCard>
            <TopicsList room={room} activeTopicId={selectedTopicId} isRoomOpen={room.isOpen} />
          </UITopicsCard>
          <CloseRoomButton
            onClick={() => {
              // TODOC
            }}
          >
            {room.finished_at ? "Reopen Room" : "Close Room"}
          </CloseRoomButton>
        </UISidebar>

        <UIContentHolder>{children}</UIContentHolder>
      </UIHolder>
    </>
  );
});

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
  align-items: center;
  gap: 4px;
  ${(props) =>
    props.onClick &&
    css`
      cursor: pointer;
    `}
`;

const UIRoomTags = styled.div<{}>`
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
