import React from "react";
import styled from "styled-components";
import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { useGetSingleRoomQuery } from "~frontend/gql/rooms";
import { useUnreadMessages } from "~frontend/gql/topics";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { TopicCreationButton } from "~frontend/rooms/TopicCreationButton";
import { routes } from "~frontend/routes";
import { UIContentWrapper } from "~frontend/ui/UIContentWrapper";
import { UnreadTopicIndicator } from "~frontend/ui/UnreadTopicsIndicator";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { PageMeta } from "~frontend/utils/PageMeta";
import { ItemTitle } from "~ui/typo";

const SpaceRoomPage = () => {
  const { roomId, spaceId } = routes.spaceRoom.useParams();
  const { data: roomData } = useGetSingleRoomQuery.subscription({ id: roomId });
  const { data: unreadMessagesData } = useUnreadMessages.subscription();

  const room = roomData?.room;

  const topics = room?.topics ?? [];

  return (
    <>
      <PageMeta title={room?.name} />
      <UIContentWrapper>
        {topics.length === 0 && <UINoAgendaMessage>This room has topics yet.</UINoAgendaMessage>}

        {topics.map((topic) => {
          const unreadMessages = unreadMessagesData?.messages.find((m) => m.topicId === topic.id)?.unreadMessages ?? 0;

          return (
            <UITopic key={topic.id} onClick={() => routes.spaceRoomTopic.push({ spaceId, roomId, topicId: topic.id })}>
              <UnreadTopicIndicator unreadMessages={unreadMessages} />
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
  position: relative;
  padding: 0.5em 0.75em;
  margin-bottom: 2rem;
  cursor: pointer;
  border: 1px solid #929292;
  border-radius: 1rem;

  :hover {
    border-color: #bdbcbc;
    color: #676767;
  }
`;

const UINoAgendaMessage = styled.div`
  margin-bottom: 1rem;
`;
