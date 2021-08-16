import { useRouter } from "next/router";
import styled from "styled-components";

import { useIsCurrentUserRoomMember } from "~frontend/gql/rooms";
import { ManageRoomMembers } from "~frontend/ui/rooms/ManageRoomMembers";
import { RoomDetailedInfoFragment } from "~gql";
import { TextBody12 } from "~ui/typo";

import { DeadlineManager } from "./DeadlineManager";

interface Props {
  room: RoomDetailedInfoFragment;
}

export function RoomSidebarInfo({ room }: Props) {
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
          <TextBody12 speziaMono secondary>
            Due date
          </TextBody12>
          <DeadlineManager room={room} isReadonly={!amIMember} />
        </UIManageSection>
      </UIManageSections>
    </UIRoomInfo>
  );
}

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
