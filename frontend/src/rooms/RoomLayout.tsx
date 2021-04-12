import React, { ReactNode } from "react";
import styled from "styled-components";
import { SidebarLayout } from "@acapela/frontend/design/Layout";
import { AvatarList } from "@acapela/frontend/design/AvatarList";
import { NavLink } from "@acapela/frontend/design/NavLink";
import { ThreadCreationButton } from "@acapela/frontend/rooms/ThreadCreationButton";
import { Button } from "@acapela/ui/button";
import {
  ParticipantBasicInfoFragment,
  ThreadDetailedInfoFragment,
  useGetSingleRoomQuery,
  useRoomParticipantsSubscription,
  useRoomThreadsSubscription,
} from "@acapela/frontend/gql";
import { AvatarProps } from "@acapela/frontend/design/Avatar";
import { InviteButton } from "./InviteButton";
import { usePathParameter } from "@acapela/frontend/utils";
import { assert } from "@acapela/shared/assert";
import Head from "next/head";

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
      <Head>{room && <title>{room.name} | Acapela</title>}</Head>
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
