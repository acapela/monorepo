import React, { useState } from "react";
import styled from "styled-components";
import { PageTitle, SecondaryText } from "~ui/typo";
import { useSingleRoomQuery, useUpdateRoomMutation } from "~frontend/gql/rooms";
import { RoomView } from "./RoomView";
import { TextArea } from "~ui/forms/TextArea";
import { TopicSummary } from "./TopicSummary";
import { useDebounce } from "react-use";
import { formatDate } from "./shared";

interface Props {
  roomId: string;
}

const AUTO_SAVE_DEBOUNCE_DELAY_MS = 400;

export function RoomSummaryView({ roomId }: Props) {
  const [room] = useSingleRoomQuery({ id: roomId });

  const [roomSummary, setRoomSummary] = useState(room?.summary ?? "");

  const [updateRoom] = useUpdateRoomMutation();

  useDebounce(
    () => {
      room &&
        updateRoom({
          roomId: room.id,
          input: {
            summary: roomSummary,
          },
        });
    },
    AUTO_SAVE_DEBOUNCE_DELAY_MS,
    [roomSummary]
  );

  return (
    <RoomView room={room} selectedTopicId={null}>
      <UIHolder>
        <UIHeader>
          <PageTitle>Summary</PageTitle>
          {room && room.finished_at && <SecondaryText>Created {formatDate(room.finished_at)}</SecondaryText>}
        </UIHeader>
        <UITopicSummaries>
          {room?.topics.map((topic) => (
            <TopicSummary key={topic.id} topic={topic} />
          ))}
        </UITopicSummaries>
        <UIAdditionalNotes
          placeholder={"Add any additional notes..."}
          value={roomSummary}
          isResizable={true}
          onChangeText={setRoomSummary}
        />
      </UIHolder>
    </RoomView>
  );
}

const UIHolder = styled.div`
  padding: 60px;
  overflow-y: auto;
  height: 100%;
`;

const UIHeader = styled.div`
  ${SecondaryText} {
    line-height: 2rem;
  }
`;

const UITopicSummaries = styled.div`
  display: grid;
  gap: 16px;
  padding: 40px 0;
`;

const UIAdditionalNotes = styled(TextArea)`
  padding: 0;
  border: 0;
  width: 100%;
`;
