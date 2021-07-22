import styled from "styled-components";
import { isCurrentUserRoomMember } from "~frontend/gql/rooms";
import { RoomMembers } from "~frontend/ui/rooms/ManageRoomMembers";
import { RoomDetailedInfoFragment } from "~gql";
import { TextBody12 } from "~ui/typo";
import { DeadlineManager } from "./DeadlineManager";

interface Props {
  room: RoomDetailedInfoFragment;
  onUserLeavingRoom: () => Promise<void>;
}

export function RoomSidebarInfo({ room, onUserLeavingRoom }: Props) {
  const amIMember = isCurrentUserRoomMember(room ?? undefined);

  return (
    <UIRoomInfo>
      <UIManageSection>
        <RoomMembers onCurrentUserLeave={onUserLeavingRoom} room={room} />
      </UIManageSection>

      <UIManageSections>
        <UIManageSection>
          <TextBody12 speziaMono secondary>
            Due date
          </TextBody12>
          <DeadlineManager room={room} isReadonly={!amIMember} />
        </UIManageSection>
      </UIManageSections>
    </UIRoomInfo>
  );
}

const UIRoomInfo = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, auto);
  align-content: start;
  gap: 16px;
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
