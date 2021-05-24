import styled from "styled-components";
import { useSingleRoomQuery } from "~frontend/gql/rooms";
import { PageMeta } from "~frontend/utils/PageMeta";
import { TopicView } from "../topic/TopicView";
import { TopicsList } from "./TopicsList";

interface Props {
  roomId: string;
  topicId: string | null;
}

export function RoomView({ roomId, topicId }: Props) {
  const [roomData] = useSingleRoomQuery.subscription({ id: roomId });

  function getSelectedTopicId() {
    if (topicId) return topicId;

    return roomData?.room?.topics?.[0].id ?? null;
  }

  const selectedTopicId = getSelectedTopicId();

  return (
    <>
      <PageMeta title={roomData?.room?.name} />
      <UIHolder>
        <UITopicsHolder>
          <TopicsList roomId={roomId} activeTopicId={selectedTopicId} />
        </UITopicsHolder>
        <UITopicContentHolder>{selectedTopicId && <TopicView id={selectedTopicId} />}</UITopicContentHolder>
      </UIHolder>
    </>
  );
}

const UIHolder = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  width: 100%;
  flex-grow: 1;
  grid-gap: 2rem;
  min-height: 0;
`;

const UITopicsHolder = styled.div``;

const UITopicContentHolder = styled.div`
  flex-grow: 1;
  background: #ffffff;
  border: 1px solid #f8f8f8;
  box-sizing: border-box;
  box-shadow: 0px 12px 132px rgba(0, 0, 0, 0.05);
  border-radius: 1rem;
  padding: 2rem;
  min-height: 0;
`;
