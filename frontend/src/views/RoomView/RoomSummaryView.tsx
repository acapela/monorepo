import React, { useState } from "react";
import styled from "styled-components";
import { TextH3, TextBody } from "~ui/typo";
import { useUpdateRoomMutation } from "~frontend/gql/rooms";
import { RoomView } from "./RoomView";
import { TextArea } from "~ui/forms/TextArea";
import { TopicSummary } from "./TopicSummary";
import { useDebounce } from "react-use";
import { formatDate } from "./shared";
import { RoomDetailedInfoFragment } from "~gql";

interface Props {
  room: RoomDetailedInfoFragment;
}

const AUTO_SAVE_DEBOUNCE_DELAY_MS = 400;

export function RoomSummaryView({ room }: Props) {
  const [roomSummary, setRoomSummary] = useState(room.summary ?? "");

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
          <TextH3>Summary</TextH3>
          {room && room.finished_at && <TextBody>Created {formatDate(room.finished_at)}</TextBody>}
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

const UIHolder = styled.div<{}>`
  padding: 60px;
  overflow-y: auto;
  height: 100%;
`;

const UIHeader = styled.div<{}>`
  ${TextBody} {
    line-height: 2rem;
  }
`;

const UITopicSummaries = styled.div<{}>`
  display: grid;
  gap: 16px;
  padding: 40px 0;
`;

const UIAdditionalNotes = styled(TextArea)<{}>`
  padding: 0;
  border: 0;
  border-radius: 0px;
  width: 100%;
`;
