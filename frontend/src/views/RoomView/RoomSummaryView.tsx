import React, { useState } from "react";
import styled from "styled-components";
import { PageTitle, SecondaryText } from "~ui/typo";
import { useSingleRoomQuery, useUpdateRoomMutation } from "~frontend/gql/rooms";
import { useRoomTopicList } from "~frontend/rooms/useRoomTopicList";
import { RoomView } from "./RoomView";
import { TextArea } from "~ui/forms/TextArea";
import { TopicSummary } from "./TopicSummary";
import { useDebounce } from "react-use";

interface Props {
  roomId: string;
}

const localeOptions: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };

export const parseDate = (str: string) => new Date(str).toLocaleDateString(undefined, localeOptions);

const DEBOUNCE_DELAY_MS = 400;

export function RoomSummaryView({ roomId }: Props) {
  const [roomQuery] = useSingleRoomQuery({ id: roomId });
  const [updateRoom] = useUpdateRoomMutation();

  const room = roomQuery?.room;

  const [roomSummary, setRoomSummary] = useState(room?.summary ?? "");

  useDebounce(
    () => {
      updateRoom({
        roomId: room?.id,
        input: {
          summary: roomSummary,
        },
      });
    },
    DEBOUNCE_DELAY_MS,
    [roomSummary]
  );

  const { topics } = useRoomTopicList(room?.id);

  return (
    <RoomView room={room} selectedTopicId={null}>
      <UIHolder>
        <UIHeader>
          <PageTitle>Summary</PageTitle>
          <SecondaryText>Created {parseDate(room?.finished_at)}</SecondaryText>
        </UIHeader>
        <UITopicSummaries>
          {topics.map((topic) => (
            <TopicSummary key={topic.id} topic={topic} />
          ))}
        </UITopicSummaries>
        <UIAdditionalNotes
          placeholder={"Add any additional notes..."}
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
