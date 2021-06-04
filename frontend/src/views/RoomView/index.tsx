import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import styled from "styled-components";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { routes } from "~frontend/routes";
import { useSingleRoomQuery } from "~frontend/gql/rooms";
import { PageMeta } from "~frontend/utils/PageMeta";
import { TopicView } from "../topic/TopicView";
import { TopicsList } from "./TopicsList";
import { VStack } from "~ui/Stack";
import { UIText } from "~ui/UIText";
import { Deadline } from "./Deadline";

interface Props {
  roomId: string;
  topicId: string | null;
}

export function RoomView({ roomId, topicId }: Props) {
  const [roomData] = useSingleRoomQuery({ id: roomId });

  const firstTopic = roomData?.room?.topics?.[0] ?? null;

  function getSelectedTopicId() {
    if (topicId) return topicId;

    return firstTopic?.id ?? null;
  }

  const selectedTopicId = getSelectedTopicId();

  /*
    Routing on changes to topic

    We verify that a topic provided by the url exists within the topics of the room.
    This handle cases of deleted topics, and a "soft-catch" to potential 404 scenarios.

    Empty rooms will be route to their path without topicId.
    Topic ids given through url that are not found in the room, route to the first topic in room.
  */
  useEffect(() => {
    const topicsInRoom = roomData?.room?.topics;

    // Newly created room stores topics as `null`
    if (!roomData?.room || !topicsInRoom) {
      return;
    }

    const topicIdGivenByUrl = topicId;
    const roomHasTopics = topicsInRoom.length > 0;
    const isFoundInRoom = (toFind: string) => topicsInRoom.find(({ id }) => id === toFind);

    const { id: roomId, space_id: spaceId } = roomData?.room;

    const routeToRoomUrl = () =>
      routes.spaceRoom.replace({
        roomId,
        spaceId,
      });

    const routeToFirstTopicUrl = () =>
      routes.spaceRoomTopic.replace({
        topicId: firstTopic?.id,
        roomId,
        spaceId,
      });

    if (topicIdGivenByUrl) {
      if (!roomHasTopics) {
        routeToRoomUrl();
      } else if (roomHasTopics && !isFoundInRoom(topicIdGivenByUrl)) {
        routeToFirstTopicUrl();
      }
    } else {
      if (roomHasTopics) {
        routeToFirstTopicUrl();
      }
    }
  }, [topicId, firstTopic, roomData?.room?.topics]);

  return (
    <>
      <PageMeta title={roomData?.room?.name} />
      <UIHolder>
        <VStack gap={10}>
          <UIText weight="bold" size={27}>
            {roomData?.room?.name}
          </UIText>
          <VStack gap={16}>
            <VStack gap={10}>
              <UIText size={14} color="#7F7E7F">
                Due date
              </UIText>
              {roomData?.room && <Deadline room={roomData.room} />}
            </VStack>
          </VStack>
          <UILine />
          <TopicsList roomId={roomId} activeTopicId={selectedTopicId} />
        </VStack>
        <AnimatePresence exitBeforeEnter>
          <UITopicContentHolder key={selectedTopicId} presenceStyles={{ opacity: [0, 1] }}>
            {selectedTopicId && <TopicView id={selectedTopicId} />}
          </UITopicContentHolder>
        </AnimatePresence>
      </UIHolder>
    </>
  );
}

const UIHolder = styled.div`
  display: grid;
  grid-template-columns: 360px 1fr;
  width: 100%;
  flex-grow: 1;
  grid-gap: 2rem;
  min-height: 0;
`;

const UILine = styled.div`
  height: 1px;
  background: #ebebec;
`;

const UITopicContentHolder = styled(PresenceAnimator)`
  flex-grow: 1;
  background: #ffffff;
  border: 1px solid #f8f8f8;
  box-sizing: border-box;
  box-shadow: 0px 12px 132px rgba(0, 0, 0, 0.05);
  border-radius: 1rem;
  padding: 2rem;
  min-height: 0;
`;
