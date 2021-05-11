import Head from "next/head";
import React, { ReactNode } from "react";
import styled from "styled-components";
import { AvatarProps } from "~frontend/design/Avatar";
import { AvatarList } from "~frontend/design/AvatarList";
import { SidebarLayout } from "~frontend/design/Layout";
import { NavLink } from "~frontend/design/NavLink";
import { ParticipantBasicInfoFragment, TopicDetailedInfoFragment } from "~frontend/gql";
import { useGetSingleRoomQuery, useRoomParticipantsSubscription } from "~frontend/gql/rooms";
import { useRoomTopicsSubscription } from "~frontend/gql/topics";
import { TopicCreationButton } from "~frontend/rooms/TopicCreationButton";
import { usePathParameter } from "~frontend/utils";
import { assert } from "~shared/assert";
import { Button } from "~ui/button";
import { InviteButton } from "./InviteButton";

interface Props {
  children: ReactNode;
}

const UIStyledInviteButton = styled(InviteButton)`
  margin-top: 0.5rem;
`;

const UITopicsWrapper = styled.div`
  margin-top: 1rem;

  ${Button} {
    margin-top: 0.5rem;
  } ;
`;

const useTopics = (roomId: string): { loading: boolean; topics: TopicDetailedInfoFragment[] } => {
  const { data, loading } = useRoomTopicsSubscription({ roomId });

  return { loading, topics: data?.topics ?? [] };
};

const useParticipants = (roomId: string): { loading: boolean; participants: ParticipantBasicInfoFragment[] } => {
  const { data, loading } = useRoomParticipantsSubscription({ roomId });

  return { loading, participants: data?.participants ?? [] };
};

export const RoomLayout: React.FC<Props> = ({ children }) => {
  const roomId = usePathParameter("roomId");

  assert(roomId, "Room ID Required");

  const { topics } = useTopics(roomId);

  const { participants } = useParticipants(roomId);

  const { data } = useGetSingleRoomQuery({ id: roomId });

  const room = data?.room;

  return (
    <>
      <Head>
        <title>{room?.name} | Acapela</title>
      </Head>
      <SidebarLayout
        sidebarContent={
          <>
            <AvatarList
              avatars={participants
                .filter(({ user }) => user.avatarUrl || user.name)
                .map(({ user }) => ({ name: user.name, url: user.avatarUrl } as AvatarProps))}
            />
            <UIStyledInviteButton roomId={roomId} />
            <UITopicsWrapper>
              {topics.map(({ id, name }, index) => (
                <NavLink key={id} to={`/rooms/${roomId}/topic/${id}`}>
                  {index + 1} {name}
                </NavLink>
              ))}
              <TopicCreationButton roomId={roomId} lastTopicIndex={topics[topics.length - 1]?.index ?? 0} />
            </UITopicsWrapper>
          </>
        }
      >
        {children}
      </SidebarLayout>
    </>
  );
};
