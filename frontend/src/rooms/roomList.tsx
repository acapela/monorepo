import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { RoomBasicInfoFragment } from "~frontend/gql";
import { useUnreadMessages } from "~frontend/gql/topics";
import { RoomCreationButton } from "~frontend/rooms/RoomCreationButton";
import { AvatarList } from "~frontend/ui/AvatarList";
import { UIContentWrapper } from "~frontend/ui/UIContentWrapper";
import { useGetSpaceRoomsQuery } from "~frontend/gql/rooms";
import { UnreadTopicIndicator } from "../ui/UnreadTopicsIndicator";

const RoomLink = ({ room }: { room: RoomBasicInfoFragment }) => {
  const [unreadMessagesData] = useUnreadMessages.subscription({ roomId: room.id });
  const unreadMessages = unreadMessagesData?.messages.reduce((acc, cur) => acc + cur.unreadMessages, 0) ?? 0;

  return (
    <Link href={`/space/${room.space_id}/${room.id}`} passHref>
      <UIRoomLink>
        <UnreadTopicIndicator unreadMessages={unreadMessages} />
        <UIRoomName>{room.name || "New room"}</UIRoomName>
        <AvatarList users={room.members.map((member) => member.user)} />
      </UIRoomLink>
    </Link>
  );
};

export const RoomList = ({ spaceId }: { spaceId: string }) => {
  const [data] = useGetSpaceRoomsQuery({ spaceId });

  if (!data?.room.length) {
    return (
      <>
        <span>Start by creating new Acapela</span>
        <UIContentWrapper marginTop>
          <RoomCreationButton spaceId={spaceId} />
        </UIContentWrapper>
      </>
    );
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

const UIRoomsGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-gap: 2rem;
`;

const UIRoomLink = styled.a`
  position: relative;
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
