import React from "react";
import styled from "styled-components";
import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { useGetSingleRoomQuery } from "~frontend/gql/rooms";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { TopicCreationButton } from "~frontend/rooms/TopicCreationButton";
import { routes } from "~frontend/routes";
import { UIContentWrapper } from "~frontend/ui/UIContentWrapper";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { PageMeta } from "~frontend/utils/PageMeta";
import { ItemTitle } from "~ui/typo";

const SpaceRoomPage = () => {
  const { roomId, spaceId } = routes.spaceRoom.useParams();
  const { data } = useGetSingleRoomQuery.subscription({ id: roomId });

  const room = data?.room;

  const topics = room?.topics ?? [];

  return (
    <>
      <PageMeta title={room?.name} />
      <UIContentWrapper>
        {topics.length === 0 && <UINoAgendaMessage>This room has topics yet.</UINoAgendaMessage>}

        {topics.map((topic) => {
          return (
            <UITopic key={topic.id} onClick={() => routes.spaceRoomTopic.push({ spaceId, roomId, topicId: topic.id })}>
              <ItemTitle>Topic: {topic.name}</ItemTitle>
            </UITopic>
          );
        })}
        <TopicCreationButton roomId={room?.id} />
      </UIContentWrapper>
    </>
  );
};

export const getServerSideProps = withServerSideAuthRedirect();

assignPageLayout(SpaceRoomPage, AppLayout);

export default SpaceRoomPage;

const UITopic = styled.div`
  margin-bottom: 2rem;
`;

const UINoAgendaMessage = styled.div`
  margin-bottom: 1rem;
`;
