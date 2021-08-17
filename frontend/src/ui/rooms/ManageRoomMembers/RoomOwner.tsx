import styled from "styled-components";

import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { RoomDetailedInfoFragment } from "~gql";
import { theme } from "~ui/theme";

interface Props {
  room: RoomDetailedInfoFragment;
}

export const RoomOwner = ({ room }: Props) => {
  return (
    <UIHolder data-tooltip={`${room.owner.name} (Room Owner)`}>
      <UserAvatar disableNameTooltip size="medium" user={room.owner} />
    </UIHolder>
  );
};

const UIHolder = styled.div`
  ${theme.shadow.item};
`;
