import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { AvatarList } from "@acapela/frontend/design/AvatarList";
import { RoomBasicInfoFragment, useGetRoomsQuery } from "@acapela/frontend/gql";

const UIRoomsGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-gap: 2rem;
`;

const UIRoomLink = styled.a`
  display: block;
  width: 100%;
  padding: 1rem;
  font-weight: 600;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  transition: transform cubic-bezier(0.4, 0, 0.2, 1) 150ms;
  transform: translate3d(0, 0, 0);

  &:hover {
    transform: translate3d(0, -0.125rem, 0);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  &:active {
    transform: translate3d(0, 0, 0);
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
          }))}
        />
      </UIRoomLink>
    </Link>
  );
};

export const RoomList: React.FC<unknown> = () => {
  const { loading, data } = useGetRoomsQuery();

  // TODO: Loader
  if (loading) {
    return <span>Loading...</span>;
  }

  if (!data?.room.length) {
    return <span>Start by creating new Acapela</span>;
  }

  return (
    <UIRoomsGrid>
      {data.room.map((room) => (
        <li key={room.id}>
          <RoomLink room={room} />
        </li>
      ))}
    </UIRoomsGrid>
  );
};
