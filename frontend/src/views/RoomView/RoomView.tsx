import { useRef, useState } from "react";
import styled, { css } from "styled-components";
import { CardBase } from "~ui/card/Base";
import { isCurrentUserRoomMember, updateRoom } from "~frontend/gql/rooms";
import { getRoomManagePopoverOptions, handleToggleCloseRoom } from "~frontend/rooms/editOptions";
import { routes } from "~frontend/routes";
import { CircleOptionsButton } from "~frontend/ui/options/OptionsButton";
import { PageMeta } from "~frontend/utils/PageMeta";
import { RoomDetailedInfoFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { borderRadius } from "~ui/baseStyles";
import { Button } from "~ui/buttons/Button";
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

export function RoomView({ room, selectedTopicId, children }: Props) {
  const titleHolderRef = useRef<HTMLDivElement>(null);
  const [isEditingRoomName, setIsEditingRoomName] = useState(false);

  const [isChangingRoomState, { set: startLoading, unset: endLoading }] = useBoolean(false);
  const amIMember = isCurrentUserRoomMember(room ?? undefined);

  const isRoomOpen = !room.finished_at;

  const onCloseRoomToggleClicked = async () => {
    if (!room) return;

    startLoading();

    const isRoomOpen = await handleToggleCloseRoom(room as RoomDetailedInfoFragment);

    if (!isRoomOpen) {
      routes.spaceRoomSummary.replace({
        roomId: room.id,
        spaceId: room.space_id,
      });
    } else if (routes.spaceRoomSummary.getIsActive()) {
      routes.spaceRoom.replace({
        roomId: room.id,
        spaceId: room.space_id,
      });
    } else {
      endLoading();
    }
  };

  async function handleRoomNameChange(newName: string) {
    await updateRoom({ roomId: room.id, input: { name: newName } });
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
            <TopicsList room={room} activeTopicId={selectedTopicId} isRoomOpen={isRoomOpen} />
          </CardBase>

          <UIFlyingCloseRoomToggle>
            <Button
              isWide={true}
              onClick={onCloseRoomToggleClicked}
              isLoading={isChangingRoomState}
              isDisabled={
                !amIMember && { reason: `You have to be room member to ${isRoomOpen ? "close" : "open"} room` }
              }
            >
              {!isRoomOpen && "Reopen room"}
              {isRoomOpen && "Close room"}
            </Button>
          </UIFlyingCloseRoomToggle>
        </UIRoomInfo>

        <UIContentHolder>{children}</UIContentHolder>
      </UIHolder>
    </>
  );
}

const UIHolder = styled.div`
  display: grid;
  grid-template-columns: 360px 1fr;
  width: 100%;
  flex-grow: 1;
  grid-gap: 2rem;
  min-height: 0;
`;

const UIRoomInfo = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, auto);
  align-content: start;
  gap: 24px;
  overflow-y: hidden;
`;

const UIContentHolder = styled.div`
  flex-grow: 1;
  background: #ffffff;
  border: 1px solid #f8f8f8;
  box-sizing: border-box;
  box-shadow: 0px 12px 132px rgba(0, 0, 0, 0.05);
  ${borderRadius.card};
  padding: 2rem;
  min-height: 0;
`;

const UIRoomHead = styled(TextH4)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UIRoomTitle = styled.div`
  padding-right: 16px;
  ${(props) =>
    props.onClick &&
    css`
      cursor: pointer;
    `}
`;

const UIFlyingCloseRoomToggle = styled.div`
  position: absolute;
  width: 100%;
  padding: 0 16px;
  bottom: 0;
`;
