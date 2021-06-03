import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo } from "react";
import styled from "styled-components";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { routes } from "~frontend/routes";
import { useSingleRoomQuery } from "~frontend/gql/rooms";
import { PageMeta } from "~frontend/utils/PageMeta";
import { TopicView } from "../topic/TopicView";
import { TopicsList } from "./TopicsList";
import { RoomContext, RoomContextProps } from "./RoomContext";

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

  // If this view is opened without topic, but room has some topic - redirect to the first one
  useEffect(() => {
    if (topicId) return;
    if (!firstTopic) return;

    // Note! Use replace instead of push. If we used push it might result in this annoying UX
    // when you click 'back' in your browser and it goes back for a moment and then returns to previous page.
    routes.spaceRoomTopic.replace({
      topicId: firstTopic.id,
      roomId: firstTopic.room.id,
      spaceId: firstTopic.room.space_id,
    });
  }, [topicId, firstTopic]);

  const roomContext = useMemo<RoomContextProps>(
    () => ({
      reloadRoom: () =>
        routes.spaceRoom.replace({
          roomId: roomData?.room?.id,
          spaceId: roomData?.room?.space_id,
        }),
    }),
    [roomData]
  );

  return (
    <RoomContext.Provider value={roomContext}>
      <PageMeta title={roomData?.room?.name} />
      <UIHolder>
        <UITopicsHolder>
          <TopicsList roomId={roomId} activeTopicId={selectedTopicId} />
        </UITopicsHolder>
        <AnimatePresence exitBeforeEnter>
          <UITopicContentHolder key={selectedTopicId} presenceStyles={{ opacity: [0, 1] }}>
            {selectedTopicId && <TopicView id={selectedTopicId} />}
          </UITopicContentHolder>
        </AnimatePresence>
      </UIHolder>
    </RoomContext.Provider>
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
