import * as clipboard from "clipboard-polyfill";
import React, { useState } from "react";
import { useDebounce } from "react-use";
import styled from "styled-components";

import { RoomDetailedInfoFragment } from "~gql";
import { handleWithStopPropagation } from "~shared/events";
import { Button } from "~ui/buttons/Button";
import { TextArea } from "~ui/forms/TextArea";
import { IconClipboardCheck, IconCopy } from "~ui/icons";
import { theme } from "~ui/theme";
import { addToast } from "~ui/toasts/data";

import { convertRoomToHtml, convertRoomToPlainText } from "./RoomSummary/roomConverter";
import { RoomView } from "./RoomView";
import { formatDate, useUpdateRoom } from "./shared";
import { TopicSummary } from "./TopicSummary";

interface Props {
  room: RoomDetailedInfoFragment;
}

const AUTO_SAVE_DEBOUNCE_DELAY_MS = 400;

export function RoomSummaryView({ room }: Props) {
  const [roomSummary, setRoomSummary] = useState(room.summary ?? "");

  const [updateRoom] = useUpdateRoom();

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

  async function handleCopy() {
    const item = new clipboard.ClipboardItem({
      "text/html": new Blob([convertRoomToHtml(room)], { type: "text/html" }),
      "text/plain": new Blob([convertRoomToPlainText(room)], { type: "text/plain" }),
    });

    await clipboard.write([item]);

    addToast({
      type: "success",
      title: "Room summary copied to clipboard",
      icon: <IconClipboardCheck />,
    });
  }

  return (
    <RoomView room={room} selectedTopicId={null}>
      <UIHolder>
        <UIHeader>
          <UITitle>Room Summary</UITitle>
          {room && room.finished_at && <UIRoomClosingTime>Created {formatDate(room.finished_at)}</UIRoomClosingTime>}
        </UIHeader>

        <UILine />

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
        <Button
          kind="secondary"
          iconPosition="start"
          icon={<IconCopy />}
          onClick={handleWithStopPropagation(() => handleCopy())}
        >
          Copy summary as text
        </Button>
      </UIHolder>
    </RoomView>
  );
}

const UIHolder = styled.div<{}>`
  padding: 32px 60px;
  overflow-y: auto;
  height: 100%;
  background-color: ${theme.colors.layout.foreground()};
`;

const UITitle = styled.div<{}>`
  ${theme.font.h4.spezia.build}
`;

const UIRoomClosingTime = styled.div<{}>`
  ${theme.font.body12.speziaMono.semibold.build}
  color: ${theme.colors.layout.supportingText()}
`;

const UIHeader = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const UILine = styled.hr<{}>`
  margin: 24px 0;
  width: 100%;
  height: 1px;
  background: ${theme.colors.layout.softLine()};
`;

const UITopicSummaries = styled.div<{}>`
  display: grid;
  gap: 16px;
  padding-bottom: 32px;
`;

const UIAdditionalNotes = styled(TextArea)<{}>`
  padding: 0;
  border: 0;
  border-radius: 0px;
  width: 100%;
`;
