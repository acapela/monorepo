import { gql } from "@apollo/client";
import styled from "styled-components";

import { withFragments } from "~frontend/gql/utils";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { RoomOwner_RoomFragment } from "~gql";
import { theme } from "~ui/theme";

const fragments = {
  room: gql`
    ${UserAvatar.fragments.user}

    fragment RoomOwner_room on room {
      owner {
        name
        ...UserAvatar_user
      }
    }
  `,
};

type Props = { room: RoomOwner_RoomFragment };

export const RoomOwner = withFragments(fragments, ({ room }: Props) => (
  <UIHolder data-tooltip={`${room.owner.name} (Room Owner)`}>
    <UserAvatar disableNameTooltip size="medium" user={room.owner} />
  </UIHolder>
));

const UIHolder = styled.div`
  ${theme.shadow.item};
`;
