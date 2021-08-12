import { gql } from "@apollo/client";
import React, { useRef } from "react";
import styled, { css } from "styled-components";

import { useDeleteRoom, useIsCurrentUserRoomMember } from "~frontend/gql/rooms";
import { withFragments } from "~frontend/gql/utils";
import { getRoomManagePopoverOptions } from "~frontend/rooms/editOptions";
import { RoomStoreContext } from "~frontend/rooms/RoomStore";
import { CircleOptionsButton } from "~frontend/ui/options/OptionsButton";
import { PageMeta } from "~frontend/utils/PageMeta";
import { RoomView_RoomFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { CardBase } from "~ui/card/Base";
import { CollapsePanel } from "~ui/collapse/CollapsePanel";
import { EditableText } from "~ui/forms/EditableText";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { GoogleCalendarIcon } from "~ui/social/GoogleCalendarIcon";
import { PrivateTag } from "~ui/tags";
import { TextH4 } from "~ui/typo";

import { RoomSidebarInfo } from "./RoomSidebarInfo";
import { useUpdateRoom } from "./shared";
import { TopicsList } from "./TopicsList";

const fragments = {
  room: gql`
    ${useIsCurrentUserRoomMember.fragments.room}
    ${getRoomManagePopoverOptions.fragments.room}
    ${RoomSidebarInfo.fragments.room}
    ${TopicsList.fragments.room}

    fragment RoomView_room on room {
      id
      name
      finished_at
      is_private
      source_google_calendar_event_id
      ...IsCurrentUserRoomMember_room
      ...EditOptions_room
      ...RoomSidebarInfo_room
      ...TopicList_room
    }
  `,
};

interface Props {
  room: RoomView_RoomFragment;
  selectedTopicId: string | null;
  children: React.ReactNode;
}

export const RoomView = withFragments(fragments, function RoomView(props: Props) {
  return (
    // Re-create context if re-rendered for a different room
    <RoomStoreContext key={props.room.id}>
      <RoomViewDisplayer {...props} />
    </RoomStoreContext>
  );
});

function RoomViewDisplayer({ room, selectedTopicId, children }: Props) {
  const titleHolderRef = useRef<HTMLDivElement>(null);
  const [isEditingRoomName, { set: enterNameEditMode, unset: exitNameEditMode }] = useBoolean(false);
  const amIMember = useIsCurrentUserRoomMember(room);

  const [updateRoom] = useUpdateRoom();
  const [deleteRoom] = useDeleteRoom();

  const isRoomOpen = !room.finished_at;

  async function handleRoomNameChange(newName: string) {
    const oldRoomName = room.name;
    await updateRoom({ variables: { id: room.id, input: { name: newName } } });
    trackEvent("Renamed Room", { roomId: room.id, newRoomName: newName, oldRoomName });
  }

  return (
    <>
      <PageMeta title={room.name} />
      <UIHolder>
        <UIRoomInfo>
          <CollapsePanel
            persistanceKey={`room-info-${room.id}`}
            initialIsOpened={true}
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
                    options={getRoomManagePopoverOptions({
                      room,
                      onEditRoomNameRequest: () => enterNameEditMode(),
                      onUpdateRoom: (variables) => updateRoom({ variables }),
                      onDeleteRoom: (variables) => deleteRoom({ variables }),
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

          <CardBase>
            <TopicsList room={room} activeTopicId={selectedTopicId} isRoomOpen={isRoomOpen} />
          </CardBase>
        </UIRoomInfo>

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

const UIRoomInfo = styled.div<{}>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  overflow-y: auto;
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
