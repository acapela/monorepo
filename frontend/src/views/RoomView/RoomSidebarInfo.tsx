import { gql } from "@apollo/client";
import { useRouter } from "next/router";
import styled from "styled-components";

import { useIsCurrentUserRoomMember } from "~frontend/gql/rooms";
import { withFragments } from "~frontend/gql/utils";
import { ManageRoomMembers } from "~frontend/ui/rooms/ManageRoomMembers";
import { RoomSidebarInfo_RoomFragment } from "~gql";
import { InputLabel } from "~ui/theme/functional";

import { DeadlineManager } from "./DeadlineManager";
import { RecurranceManager } from "./RecurranceManager";

const fragments = {
  room: gql`
    ${useIsCurrentUserRoomMember.fragments.room}
    ${ManageRoomMembers.fragments.room}
    ${DeadlineManager.fragments.room}

    fragment RoomSidebarInfo_room on room {
      space_id
      ...IsCurrentUserRoomMember_room
      ...ManageRoomMembers_room
      ...DeadlineManager_room
    }
  `,
};

interface Props {
  room: RoomSidebarInfo_RoomFragment;
}

export const RoomSidebarInfo = withFragments(fragments, function RoomSidebarInfo({ room }: Props) {
  const router = useRouter();

  const amIMember = useIsCurrentUserRoomMember(room ?? undefined);

  const handleRoomLeave = () => {
    router.replace(`/space/${room?.space_id || ""}`);
  };

  return (
    <UIRoomInfo>
      <ManageRoomMembers onCurrentUserLeave={handleRoomLeave} room={room} />

      <UIManageSections>
        <UIManageSection>
          <InputLabel>Recurrance</InputLabel>
          <RecurranceManager room={room} isReadonly={!amIMember} />
        </UIManageSection>
        <UIManageSection>
          <InputLabel>Due date</InputLabel>
          <DeadlineManager room={room} isReadonly={!amIMember} />
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
