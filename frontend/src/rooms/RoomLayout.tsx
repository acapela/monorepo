import Head from "next/head";
import React, { ReactNode } from "react";
import styled from "styled-components";
import { AvatarProps } from "~frontend/design/Avatar";
import { AvatarList } from "~frontend/design/AvatarList";
import { SidebarLayout } from "~frontend/design/Layout";
import { NavLink } from "~frontend/design/NavLink";
import {
  ParticipantBasicInfoFragment,
  ThreadDetailedInfoFragment,
  useGetSingleRoomQuery,
  useRoomParticipantsSubscription,
  useRoomThreadsSubscription,
} from "~frontend/gql";
import { ThreadCreationButton } from "~frontend/rooms/ThreadCreationButton";
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

const UIThreadsWrapper = styled.div`
  margin-top: 1rem;

  /* ThreadCreationButton */
  ${Button} {
    margin-top: 0.5rem;
  } ;
`;

const useThreads = (roomId: string): { loading: boolean; threads: ThreadDetailedInfoFragment[] } => {
  const { data, loading } = useRoomThreadsSubscription({ variables: { roomId } });

  return { loading, threads: data?.threads ?? [] };
};

const useParticipants = (roomId: string): { loading: boolean; participants: ParticipantBasicInfoFragment[] } => {
  const { data, loading } = useRoomParticipantsSubscription({ variables: { roomId } });

  return { loading, participants: data?.participants ?? [] };
};

export const RoomLayout: React.FC<Props> = ({ children }) => {
  const roomId = usePathParameter("roomId");

  assert(roomId, "Room ID Required");

  const { threads } = useThreads(roomId);

  const { participants } = useParticipants(roomId);

  const { data } = useGetSingleRoomQuery({ variables: { id: roomId } });

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
            <UIThreadsWrapper>
              {threads.map(({ id, name }, index) => (
                <NavLink key={id} to={`/rooms/${roomId}/threads/${id}`}>
                  {index + 1} {name}
                </NavLink>
              ))}
              <ThreadCreationButton roomId={roomId} lastThreadIndex={threads[threads.length - 1]?.index ?? 0} />
            </UIThreadsWrapper>
          </>
        }
      >
        {children}
      </SidebarLayout>
    </>
  );
};
