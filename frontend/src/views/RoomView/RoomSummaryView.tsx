import React, { useState } from "react";
import * as clipboard from "clipboard-polyfill";
import { useDebounce } from "react-use";
import styled from "styled-components";
import { Button } from "~ui/buttons/Button";
import { useUpdateRoomMutation } from "~frontend/gql/rooms";
import { RoomDetailedInfoFragment } from "~gql";
import { TextArea } from "~ui/forms/TextArea";
import { TextBody, TextH3 } from "~ui/typo";
import { RoomView } from "./RoomView";
import { formatDate } from "./shared";
import { TopicSummary } from "./TopicSummary";
import { convertRoomToHtml, convertRoomToPlainText } from "./RoomSummary/roomConverter";
import { handleWithStopPropagation } from "~shared/events";
import { addToast } from "~ui/toasts/data";
import { IconClipboardCheck, IconCopy } from "~ui/icons";

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
