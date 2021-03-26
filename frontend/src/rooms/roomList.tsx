import styled from "styled-components";
import Link from "next/link";
import { AvatarList } from "../design/Avatar";
import { RoomBasicInfoFragment, useGetRoomsQuery } from "../gql";

const UIRoomsGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-gap: 2rem;
  gap: 2rem;
`;

export const RoomList: React.FC<unknown> = () => {
  const { loading, data } = useGetRoomsQuery();

  // TODO: Loader
  if (loading) {
    return <span>Loading...</span>;
  }

  return (
    <UIRoomsGrid>
      {data?.room.map((room) => (
        <li key={room.id}>
          <RoomLink room={room} />
        </li>
      ))}
    </UIRoomsGrid>
  );
};

// TODO: Remove TW variables
const UIRoomLink = styled.a`
  display: block;
  width: 100%;
  margin-bottom: 0.25rem;
  padding: 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;

  --tw-bg-opacity: 1;
  background-color: rgba(255, 255, 255, var(--tw-bg-opacity));

  --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);

  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  transform: translate3d(var(--tw-translate-x), var(--tw-translate-y), 0) rotate(var(--tw-rotate))
    skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));

  &:hover {
    --tw-translate-y: -0.125rem;

    --tw-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }

  &:active {
    --tw-translate-y: 0px;
  }
`;

const UIRoomName = styled.h3`
  font-size: 1.25rem;
  line-height: 1.75rem;
  margin-bottom: 1rem;
`;

const RoomLink = ({ room }: { room: RoomBasicInfoFragment }) => {
  return (
    <Link href={`/rooms/${room.id}`} passHref>
      <UIRoomLink>
        <UIRoomName>{room.name || "New room"}</UIRoomName>
        <AvatarList
          avatars={(room.participants || []).map(({ user: { name, avatarUrl } }) => ({
            url: avatarUrl,
            name,
            className: "border-white",
          }))}
        />
      </UIRoomLink>
    </Link>
  );
};
