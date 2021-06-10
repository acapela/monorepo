import styled from "styled-components";
import { hoverActionCss } from "~ui/transitions";
import { RoomDetailedInfoFragment } from "~frontend/gql";
import { routes } from "~frontend/routes";
import { formatNumberWithMaxCallback, pluralize } from "~shared/numbers";
import { ItemTitle, SecondaryText } from "~ui/typo";
import { MembersManager } from "../MembersManager";
import { useRoomUnreadMessagesCount } from "~frontend/utils/unreadMessages";
import { ElementNotificationBadge } from "~frontend/ui/ElementNotificationBadge";
import { ManageRoomMembers } from "./ManageRoomMembers";
import { CornerOptionsMenu } from "~frontend/ui/options/CornerOptionsMenu";
import { IconEdit, IconTrash } from "~ui/icons";

interface Props {
  room: RoomDetailedInfoFragment;
  className?: string;
}

export const RoomCard = styled(function RoomCard({ room, className }: Props) {
  const unreadCount = useRoomUnreadMessagesCount(room.id);

  const topicsCount = room.topics.length;

  function handleOpen() {
    routes.spaceRoom.push({ roomId: room.id, spaceId: room.space_id });
  }

  return (
    <UIHolder onClick={handleOpen} className={className}>
      <CornerOptionsMenu
        options={[
          {
            label: "Edit space name",
            onSelect: console.log,
            icon: <IconEdit />,
          },
          {
            label: "Delete space",
            onSelect: console.log,
            icon: <IconTrash />,
            isDestructive: true,
          },
        ]}
        tooltip="Show options..."
      />
      {unreadCount > 0 && (
        <ElementNotificationBadge>{formatNumberWithMaxCallback(unreadCount, 99)}</ElementNotificationBadge>
      )}
      <ItemTitle>{room.name}</ItemTitle>
      <SecondaryText>{pluralize(topicsCount, "topic", "topics")}</SecondaryText>
      <ManageRoomMembers room={room} />
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  cursor: pointer;
  position: relative;

  ${ItemTitle} {
    margin-bottom: 0.5rem;
  }

  ${MembersManager} {
    margin-top: 0.5rem;
  }

  padding: 1rem;
  margin: -1rem;

  ${hoverActionCss}
`;
