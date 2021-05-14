import styled, { FlattenSimpleInterpolation } from "styled-components";
import { ItemTitle, SecondaryText } from "~ui/typo";
import { RoomDetailedInfoFragment } from "~frontend/gql";
import { routes } from "~frontend/routes";
import { pluralize } from "~shared/numbers";

interface Props {
  room: RoomDetailedInfoFragment;
  css?: FlattenSimpleInterpolation;
}

export function RoomCard({ room, css }: Props) {
  const topicsCount = room.topics.length;
  console.log({ css });
  return (
    <UIHolder
      css={css}
      onClick={() => {
        routes.spaceRoom.push({ roomId: room.id, spaceId: room.space_id });
      }}
    >
      <ItemTitle>{room.name}</ItemTitle>
      <SecondaryText>{pluralize(topicsCount, "topic", "topics")}</SecondaryText>
    </UIHolder>
  );
}

const UIHolder = styled.div<{ css?: FlattenSimpleInterpolation }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 21px 14px;

  ${(props) => {
    console.log(props.css);
    return props.css;
  }}

  /* Base/White */

  background: #ffffff;
  /* Borders/Default */

  border: 1px solid #ededed;
  /* Card/Default */

  box-shadow: 0px 0px 8px 4px rgba(43, 42, 53, 0.03);
  border-radius: 16px;
`;
