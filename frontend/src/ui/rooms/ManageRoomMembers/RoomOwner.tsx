import { observer } from "mobx-react";
import styled from "styled-components";

import { RoomEntity } from "~frontend/clientdb/room";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { theme } from "~ui/theme";

type Props = { room: RoomEntity };

export const RoomOwner = observer(({ room }: Props) => (
  <UIHolder data-tooltip={`${room.owner?.name} (Room Owner)`}>
    {/* TODOC */}
    {room.owner && <UserAvatar disableNameTooltip size="medium" user={room.owner} />}
  </UIHolder>
));

const UIHolder = styled.div`
  ${theme.shadow.item};
`;
