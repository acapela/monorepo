import React, { ReactNode } from "react";
import styled from "styled-components";
import { SidebarLayout } from "@acapela/frontend/design/Layout";
import { AvatarList } from "@acapela/frontend/design/Avatar";
import { NavLink } from "@acapela/frontend/design/NavLink";
import { ThreadCreationButton } from "@acapela/frontend/rooms/ThreadCreationButton";
import { Button } from "@acapela/ui/button";
import { InviteButton } from "./invites";
import { RoomDetailedInfoFragment } from "../gql";

interface Props {
  room: RoomDetailedInfoFragment;
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

export const RoomLayout: React.FC<Props> = ({ room, children }) => {
  return (
    <SidebarLayout
      sidebar={{
        content: (
          <>
            <AvatarList
              avatars={(room.participants || [])
                .filter(({ user }) => user.avatarUrl || user.name)
                .map(({ user }) => ({ name: user.name, url: user.avatarUrl }))}
            />
            <UIStyledInviteButton roomId={room.id} />
            <UIThreadsWrapper>
              {(room.threads || []).map(({ id, name }, index) => (
                <NavLink key={id} to={`/rooms/${room.id}/threads/${id}`}>
                  {index + 1} {name}
                </NavLink>
              ))}
              <ThreadCreationButton
                roomId={room.id}
                lastThreadIndex={(room.threads || [])[room.threads.length - 1]?.index}
              />
            </UIThreadsWrapper>
          </>
        ),
      }}
    >
      {children}
    </SidebarLayout>
  );
};
