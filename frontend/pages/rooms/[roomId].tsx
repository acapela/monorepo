import { useGetSingleRoomQuery } from "@acapela/frontend/gql";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { RoomLayout } from "@acapela/frontend/rooms/RoomLayout";
import { ThreadCreationButton } from "@acapela/frontend/rooms/ThreadCreationButton";
import { usePathParameter } from "@acapela/frontend/utils";
import { UIContentWrapper } from "@acapela/frontend/design/UIContentWrapper";
import { assignPageLayout } from "@acapela/frontend/utils/pageLayout";
import { withServerSideAuthRedirect } from "@acapela/frontend/authentication/withServerSideAuthRedirect";

const UINoAgendaMessage = styled.div`
  margin-bottom: 1rem;
`;

const Page = () => {
  const { replace } = useRouter();
  const roomId = usePathParameter("roomId");
  const { loading, data } = useGetSingleRoomQuery({ variables: { id: roomId } });
  const [redirecting, setRedirecting] = useState(false);

  const room = data?.room;

  useEffect(() => {
    if (room?.threads?.length) {
      setRedirecting(true);
      replace(`/rooms/${room.id}/threads/${room.threads[0].id}`).then(() => setRedirecting(false));
    }
  }, [room]);

  // TODO: use a proper loader here
  if (loading || redirecting || !room) {
    return <span>Loading...</span>;
  }

  return (
    <>
      <Head>
        <title>{room.name} | Acapela</title>
      </Head>
      <UIContentWrapper>
        <UINoAgendaMessage>This room has no agenda points yet.</UINoAgendaMessage>
        <ThreadCreationButton roomId={room.id} />
      </UIContentWrapper>
    </>
  );
};

export const getServerSideProps = withServerSideAuthRedirect();

assignPageLayout(Page, RoomLayout);

export default Page;
