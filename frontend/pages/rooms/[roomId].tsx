import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { UIContentWrapper } from "~frontend/design/UIContentWrapper";
import { useGetSingleRoomQuery } from "~frontend/gql";
import { RoomLayout } from "~frontend/rooms/RoomLayout";
import { ThreadCreationButton } from "~frontend/rooms/ThreadCreationButton";
import { usePathParameter } from "~frontend/utils";
import { assignPageLayout } from "~frontend/utils/pageLayout";

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
