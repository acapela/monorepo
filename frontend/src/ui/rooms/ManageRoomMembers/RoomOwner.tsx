import { gql } from "@apollo/client";
import styled from "styled-components";

import { withFragments } from "~frontend/gql/utils";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { RoomOwner_RoomFragment } from "~gql";
import { theme } from "~ui/theme";

export const RoomOwner = withFragments(
  {
    room: gql`
      ${UserAvatar.fragments.user}

      fragment RoomOwner_room on room {
        owner {
          name
          ...UserAvatar_user
        }
      }
    `,
  },
  ({ room }: { room: RoomOwner_RoomFragment }) => (
    <UIHolder data-tooltip={`${room.owner.name} (Room Owner)`}>
      <UserAvatar disableNameTooltip size="medium" user={room.owner} />
    </UIHolder>
  )
);

const UIHolder = styled.div`
  ${theme.shadow.item};
`;
