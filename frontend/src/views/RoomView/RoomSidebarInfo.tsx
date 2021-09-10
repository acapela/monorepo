import { observer } from "mobx-react";
import { useRouter } from "next/router";
import styled from "styled-components";

import { RoomEntity } from "~frontend/clientdb/room";
import { ManageRoomMembers } from "~frontend/ui/rooms/ManageRoomMembers";
import { InputLabel } from "~ui/theme/functional";

import { DeadlineManager } from "./DeadlineManager";
import { RecurranceManager } from "./RecurranceManager";

interface Props {
  room: RoomEntity;
}

export const RoomSidebarInfo = observer(function RoomSidebarInfo({ room }: Props) {
  const router = useRouter();

  const handleRoomLeave = () => {
    router.replace(`/space/${room?.space_id || ""}`);
  };

  return (
    <UIRoomInfo>
      <ManageRoomMembers onCurrentUserLeave={handleRoomLeave} room={room} />

      <UIManageSections>
        <UIManageSection>
          <InputLabel>Recurrance</InputLabel>
          <RecurranceManager room={room} isReadonly={!room.isCurrentUserMember} />
        </UIManageSection>
        <UIManageSection>
          <InputLabel>Due date</InputLabel>
          <DeadlineManager room={room} isReadonly={!room.isCurrentUserMember} />
        </UIManageSection>
      </UIManageSections>
    </UIRoomInfo>
  );
});

const UIRoomInfo = styled.div<{}>`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, auto);
  align-content: start;
  gap: 16px;
  overflow-y: hidden;
`;

const UIManageSections = styled.div<{}>`
  display: grid;
  grid-template-columns: minmax(0, auto);
  align-content: start;
  gap: 16px;
`;

const UIManageSection = styled.div<{}>`
  display: grid;
  grid-template-columns: minmax(0, auto);
  align-content: start;
  gap: 8px;
`;
