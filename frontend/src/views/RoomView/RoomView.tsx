import { useRef, useState } from "react";
import styled, { css } from "styled-components";
import { IconPlusSquare } from "~ui/icons";
import { isCurrentUserRoomMember, updateRoom } from "~frontend/gql/rooms";
import { getRoomManagePopoverOptions } from "~frontend/rooms/editOptions";
import { RoomStoreContext } from "~frontend/rooms/RoomStore";
import { startCreateNewTopicFlow } from "~frontend/topics/startCreateNewTopicFlow";
import { CircleOptionsButton } from "~frontend/ui/options/OptionsButton";
import { PageMeta } from "~frontend/utils/PageMeta";
import { RoomDetailedInfoFragment } from "~gql";
import { getLastElementFromArray } from "~shared/array";
import { generateId } from "~shared/id";
import { borderRadius } from "~ui/baseStyles";
import { Button } from "~ui/buttons/Button";
import { CardBase } from "~ui/card/Base";
import { CollapsePanel } from "~ui/collapse/CollapsePanel";
import { EditableText } from "~ui/forms/EditableText";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
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
  const [isEditingRoomName, setIsEditingRoomName] = useState(false);
  const amIMember = isCurrentUserRoomMember(room ?? undefined);

  const isRoomOpen = !room.finished_at;

  async function handleRoomNameChange(newName: string) {
    await updateRoom({ roomId: room.id, input: { name: newName } });
  }

  async function handleCreateNewTopic() {
    const currentLastIndex = getLastElementFromArray(room.topics)?.index;
    await startCreateNewTopicFlow({
      name: "New topic",
      slug: `new-topic-${generateId(5)}`,
      roomId: room.id,
      navigateAfterCreation: true,
      currentLastIndex,
    });
  }

  return (
    <>
      <PageMeta title={room.name} />
      <UIHolder>
        <UIRoomInfo>
          <CollapsePanel
            persistanceKey={`room-info-${room.id}`}
            headerNode={
              <UIRoomHead spezia semibold>
                <UIRoomTitle ref={titleHolderRef}>
                  <EditableText
                    value={room.name ?? ""}
                    onValueSubmit={handleRoomNameChange}
                    isInEditMode={isEditingRoomName}
                    onEditModeChangeRequest={setIsEditingRoomName}
                    allowDoubleClickEditRequest
                  />

                  {room.is_private && <PrivateTag tooltipLabel="Room is only visible to participants" />}
                </UIRoomTitle>

                {amIMember && (
                  <PopoverMenuTrigger
                    options={getRoomManagePopoverOptions(room, {
                      onEditRoomNameRequest: () => setIsEditingRoomName(true),
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
            <TopicsList key={room.id} room={room} activeTopicId={selectedTopicId} isRoomOpen={isRoomOpen} />
          </CardBase>

          <UIFlyingCloseRoomToggle>
            <Button
              onClick={handleCreateNewTopic}
              isDisabled={
                !amIMember && { reason: `You have to be room member to ${isRoomOpen ? "close" : "open"} room` }
              }
              icon={<IconPlusSquare />}
            >
              New Topic
            </Button>
          </UIFlyingCloseRoomToggle>
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
  background: #ffffff;
  border: 1px solid #f8f8f8;
  box-sizing: border-box;
  box-shadow: 0px 12px 132px rgba(0, 0, 0, 0.05);
  ${borderRadius.card};
  padding: 2rem;
  min-height: 0;
  min-width: 0;
`;

const UIRoomHead = styled(TextH4)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UIRoomTitle = styled.div<{}>`
  padding-right: 16px;
  ${(props) =>
    props.onClick &&
    css<{}>`
      cursor: pointer;
    `}
`;

const UIFlyingCloseRoomToggle = styled.div<{}>`
  display: flex;
  justify-content: center;
`;
