import { useRef } from "react";
import { useRouter } from "next/router";
import styled, { css } from "styled-components";
import { PageMeta } from "~frontend/utils/PageMeta";
import { TopicsList } from "./TopicsList";
import { DeadlineManager } from "./DeadlineManager";
import { PageTitle, SecondaryText } from "~ui/typo";
import { ManageRoomMembers } from "~frontend/ui/rooms/ManageRoomMembers";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { OptionsButton } from "~frontend/ui/options/OptionsButton";
import { getRoomManagePopoverOptions, handleEditRoomName, handleToggleCloseRoom } from "~frontend/rooms/editOptions";
import { Button } from "~ui/buttons/Button";
import { RoomDetailedInfoFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { routes } from "~frontend/routes";
import { isCurrentUserRoomMember } from "~frontend/gql/rooms";
import { borderRadius } from "~ui/baseStyles";

interface Props {
  room?: RoomDetailedInfoFragment | null;
  selectedTopicId: string | null;
  children: React.ReactNode;
}

export function RoomView({ room, selectedTopicId, children }: Props) {
  const router = useRouter();
  const titleHolderRef = useRef<HTMLDivElement>(null);

  const [isChangingRoomState, { set: startLoading, unset: endLoading }] = useBoolean(false);
  const amIMember = isCurrentUserRoomMember(room ?? undefined);

  const handleRoomLeave = () => {
    router.replace(`/space/${room?.space_id || ""}`);
  };

  const isRoomOpen = !room?.finished_at;

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

  return (
    <>
      <PageMeta title={room?.name} />
      <UIHolder>
        <UIRoomInfo>
          {room && (
            <UIRoomHead>
              <UIRoomTitle
                ref={titleHolderRef}
                {...(amIMember
                  ? {
                      ["data-tooltip"]: "Edit room name...",
                      onClick: () => handleEditRoomName(room, { ref: titleHolderRef, placement: "bottom" }),
                    }
                  : {})}
              >
                {room.name}
              </UIRoomTitle>

              {amIMember && (
                <PopoverMenuTrigger options={getRoomManagePopoverOptions(room)}>
                  <OptionsButton />
                </PopoverMenuTrigger>
              )}
            </UIRoomHead>
          )}
          <UIManageSections>
            {room && (
              <>
                <UIManageSection>
                  <SecondaryText>Due date</SecondaryText>
                  <DeadlineManager room={room} isReadonly={!amIMember} />
                </UIManageSection>
                <UIManageSection>
                  <SecondaryText>Participants</SecondaryText>
                  <ManageRoomMembers onCurrentUserLeave={handleRoomLeave} room={room} />
                </UIManageSection>
              </>
            )}
          </UIManageSections>
          <UILine />
          {room && <TopicsList room={room} activeTopicId={selectedTopicId} isRoomOpen={isRoomOpen} />}
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

const UIManageSections = styled.div`
  display: grid;
  grid-template-columns: minmax(0, auto);
  align-content: start;
  gap: 16px;
`;

const UIManageSection = styled.div`
  display: grid;
  grid-template-columns: minmax(0, auto);
  align-content: start;
  gap: 8px;
`;

const UILine = styled.div`
  height: 1px;
  background: #ebebec;
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

const UIRoomHead = styled(PageTitle)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const UIRoomTitle = styled.div`
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
