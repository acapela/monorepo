import styled from "styled-components";
import { ItemTitle, SecondaryText } from "~ui/typo";
import { RoomDetailedInfoFragment } from "~frontend/gql";
import { routes } from "~frontend/routes";
import { pluralize } from "~shared/numbers";

interface Props {
  room: RoomDetailedInfoFragment;
}

export function RoomCard({ room }: Props) {
  const topicsCount = room.topics.length;
  return (
    <UIHolder
      onClick={() => {
        routes.spaceRoom.push({ roomId: room.id, spaceId: room.space_id });
      }}
    >
      <ItemTitle>{room.name}</ItemTitle>
      <SecondaryText>{pluralize(topicsCount, "topic", "topics")}</SecondaryText>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 21px 14px;

  /* Base/White */

  background: #ffffff;
  /* Borders/Default */

  border: 1px solid #ededed;
  /* Card/Default */

  box-shadow: 0px 0px 8px 4px rgba(43, 42, 53, 0.03);
  border-radius: 16px;
`;
