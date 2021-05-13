import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { UIContentWrapper } from "~frontend/ui/UIContentWrapper";
import { useGetSingleRoomQuery } from "~frontend/gql/rooms";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { TopicCreationButton } from "~frontend/rooms/TopicCreationButton";
import { usePathParameter } from "~frontend/utils";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { PageMeta } from "~frontend/utils/PageMeta";

const UINoAgendaMessage = styled.div`
  margin-bottom: 1rem;
`;

const Page = () => {
  const { replace } = useRouter();
  const roomId = usePathParameter("roomId");
  const { loading, data } = useGetSingleRoomQuery({ id: roomId });
  const [redirecting, setRedirecting] = useState(false);

  const room = data?.room;

  useEffect(() => {
    if (room?.topics?.length) {
      setRedirecting(true);
      replace(`/rooms/${room.id}/topic/${room.topics[0].id}`).then(() => setRedirecting(false));
    }
  }, [room]);

  // TODO: use a proper loader here
  if (loading || redirecting || !room) {
    return <span>Loading...</span>;
  }

  return (
    <>
      <PageMeta title={room.name} />
      <UIContentWrapper>
        <UINoAgendaMessage>This room has no agenda points yet.</UINoAgendaMessage>
        <TopicCreationButton roomId={room.id} />
      </UIContentWrapper>
    </>
  );
};

export const getServerSideProps = withServerSideAuthRedirect();

assignPageLayout(Page, AppLayout);

export default Page;
