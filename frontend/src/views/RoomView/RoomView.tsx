import { AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { PresenceAnimator } from "~ui/PresenceAnimator";
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
import { useBoolean } from "~frontend/../../shared/hooks/useBoolean";
import { routes } from "~frontend/../routes";

interface Props {
  room?: RoomDetailedInfoFragment | null;
  selectedTopicId: string | null;
  children: React.ReactNode;
}

export function RoomView({ room, selectedTopicId, children }: Props) {
  const router = useRouter();
  const titleHolderRef = useRef<HTMLDivElement>(null);

  const [isChangingRoomState, { set: startLoading, unset: endLoading }] = useBoolean(false);

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
    } else if (routes.spaceRoomSummary.isActive(router.route)) {
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
                data-tooltip="Edit room name..."
                onClick={() => handleEditRoomName(room, { ref: titleHolderRef, placement: "bottom" })}
              >
                {room.name}
              </UIRoomTitle>

              <PopoverMenuTrigger options={getRoomManagePopoverOptions(room)}>
                <OptionsButton />
              </PopoverMenuTrigger>
            </UIRoomHead>
          )}
          <UIManageSections>
            {room && (
              <>
                <UIManageSection>
                  <SecondaryText>Due date</SecondaryText>
                  <DeadlineManager room={room} />
                </UIManageSection>
                <UIManageSection>
                  <SecondaryText>Participants</SecondaryText>
                  <ManageRoomMembers onCurrentUserLeave={handleRoomLeave} room={room} />
                </UIManageSection>
              </>
            )}
          </UIManageSections>
          <UILine />
          {room && (
            <TopicsList
              roomId={room?.id}
              spaceId={room?.space_id}
              activeTopicId={selectedTopicId}
              isRoomOpen={isRoomOpen}
            />
          )}
          <UIFlyingCloseRoomToggle>
            <Button isWide={true} onClick={onCloseRoomToggleClicked} isLoading={isChangingRoomState}>
              {!isRoomOpen && "Reopen room"}
              {isRoomOpen && "Close room"}
            </Button>
          </UIFlyingCloseRoomToggle>
        </UIRoomInfo>
        <AnimatePresence exitBeforeEnter>
          <UIContentHolder key={selectedTopicId} presenceStyles={{ opacity: [0, 1] }}>
            {children}
          </UIContentHolder>
        </AnimatePresence>
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

const UIContentHolder = styled(PresenceAnimator)`
  flex-grow: 1;
  background: #ffffff;
  border: 1px solid #f8f8f8;
  box-sizing: border-box;
  box-shadow: 0px 12px 132px rgba(0, 0, 0, 0.05);
  border-radius: 1rem;
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
  cursor: pointer;
`;

const UIFlyingCloseRoomToggle = styled.div`
  position: absolute;
  width: 100%;
  padding: 0 16px;
  bottom: 0;
`;
