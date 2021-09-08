import { gql, useMutation } from "@apollo/client";
import React, { useRef } from "react";
import styled, { css } from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useIsCurrentUserRoomMember } from "~frontend/gql/rooms";
import { withFragments } from "~frontend/gql/utils";
import { RoomStoreContext } from "~frontend/rooms/RoomStore";
import { CircleOptionsButton } from "~frontend/ui/options/OptionsButton";
import { PageMeta } from "~frontend/utils/PageMeta";
import { usePopoverEditMenuOptions } from "~frontend/views/RoomView/editOptions";
import { closeOpenTopicsPrompt } from "~frontend/views/RoomView/RoomCloseModal";
import {
  RoomView_RoomFragment,
  UpdateRoomFinishedAtMutation,
  UpdateRoomFinishedAtMutationVariables,
  UpdateRoomNameMutation,
  UpdateRoomNameMutationVariables,
} from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Button } from "~ui/buttons/Button";
import { CardBase } from "~ui/card/Base";
import { CollapsePanel } from "~ui/collapse/CollapsePanel";
import { EditableText } from "~ui/forms/EditableText";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { GoogleCalendarIcon } from "~ui/social/GoogleCalendarIcon";
import { PrivateTag } from "~ui/tags";
import { Tag } from "~ui/tags";
import { TextH4 } from "~ui/typo";

import { RoomSidebarInfo } from "./RoomSidebarInfo";
import { TopicsList } from "./TopicsList";

const fragments = {
  room: gql`
    ${useIsCurrentUserRoomMember.fragments.room}
    ${usePopoverEditMenuOptions.fragments.room}
    ${RoomSidebarInfo.fragments.room}
    ${TopicsList.fragments.room}

    fragment RoomView_room on room {
      id
      name
      finished_at
      is_private
      recurrance_interval_in_days
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

  const [updateRoomFinishedAt] = useMutation<UpdateRoomFinishedAtMutation, UpdateRoomFinishedAtMutationVariables>(
    gql`
      mutation UpdateRoomFinishedAt($id: uuid!, $finishedAt: timestamptz) {
        room: update_room_by_pk(pk_columns: { id: $id }, _set: { finished_at: $finishedAt }) {
          id
          finished_at
        }
      }
    `,
    {
      optimisticResponse: (vars) => ({
        __typename: "mutation_root",
        room: { __typename: "room", id: vars.id, finished_at: vars.finishedAt },
      }),
    }
  );
  const [updateRoomName] = useMutation<UpdateRoomNameMutation, UpdateRoomNameMutationVariables>(
    gql`
      mutation UpdateRoomName($id: uuid!, $name: String!) {
        room: update_room_by_pk(pk_columns: { id: $id }, _set: { name: $name }) {
          id
          name
        }
      }
    `,
    {
      optimisticResponse: (vars) => ({ __typename: "mutation_root", room: { __typename: "room", ...vars } }),
    }
  );

  async function handleRoomNameChange(newName: string) {
    const oldRoomName = room.name;
    await updateRoomName({ variables: { id: room.id, name: newName } });
    trackEvent("Renamed Room", { roomId: room.id, newRoomName: newName, oldRoomName });
  }

  async function handleCloseRoom() {
    const roomId = room.id;

    if (room.finished_at) {
      updateRoomFinishedAt({ variables: { id: roomId, finishedAt: null } });
      trackEvent("Reopened Room", { roomId });
      return;
    }
    const openTopics = room.topics.filter((topic) => !topic.closed_at);

    if (openTopics.length > 0) {
      const canCloseRoom = await closeOpenTopicsPrompt(room);
      if (!canCloseRoom) {
        return;
      }
    }

    updateRoomFinishedAt({ variables: { id: roomId, finishedAt: new Date().toISOString() } });
    trackEvent("Closed Room", { roomId, hasRoomOpenTopics: openTopics.length > 0 });
  }

  const editOptions = usePopoverEditMenuOptions({
    room,
    onEditRoomNameRequest: () => enterNameEditMode(),
    onCloseRoom: handleCloseRoom,
  });

  const isRoomOpen = !room.finished_at;

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
                    {room.recurrance_interval_in_days && <Tag kind="shareInformation">Recurring</Tag>}

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
            <TopicsList room={room} activeTopicId={selectedTopicId} isRoomOpen={isRoomOpen} />
          </UITopicsCard>
          <CloseRoomButton onClick={handleCloseRoom}>{room.finished_at ? "Reopen Room" : "Close Room"}</CloseRoomButton>
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
