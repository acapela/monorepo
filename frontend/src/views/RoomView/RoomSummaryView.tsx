import React from "react";
import styled from "styled-components";
import { PageTitle, SecondaryText, TextTitle } from "~ui/typo";
import { useSingleRoomQuery } from "~frontend/gql/rooms";
import { useRoomTopicList } from "~frontend/rooms/useRoomTopicList";
import { RoomView } from "./RoomView";
import { fontSize } from "~ui/baseStyles";

interface Props {
  roomId: string;
}

const localeOptions: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };

const parseDate = (str: string) => new Date(str).toLocaleDateString(undefined, localeOptions);

export function RoomSummaryView({ roomId }: Props) {
  const [roomQuery] = useSingleRoomQuery({ id: roomId });
  const room = roomQuery?.room;

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
            <UITopicSummary>
              <UITopicSummaryMetadata>
                <TextTitle>{topic.name}</TextTitle> was closed by{" "}
                <UIClosingMember>{topic.closed_by_user?.name}</UIClosingMember> · {parseDate(topic.closed_at)}
              </UITopicSummaryMetadata>
              <UITopicSummaryContent>{topic.closing_summary}</UITopicSummaryContent>
            </UITopicSummary>
          ))}
        </UITopicSummaries>
        <UIAdditionalNotes></UIAdditionalNotes>
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
  padding-bottom: 40px;
  ${SecondaryText} {
    line-height: 2rem;
  }
`;

const UITopicSummaries = styled.div`
  display: grid;
  gap: 16px;
`;

const UITopicSummary = styled.div`
  display: grid;
  gap: 8px;

  min-height: 40px;
  width: 100%;

  padding: 16px;

  border-left: 3px solid hsla(300, 2%, 92%, 1);
  border-bottom: 1px solid hsla(300, 2%, 92%, 1);
  border-top: 1px solid hsla(300, 2%, 92%, 1);
  border-right: 1px solid hsla(300, 2%, 92%, 1);

  font-size: ${fontSize.label};
  font-weight: 400;
  line-height: 1.5;
`;

const UITopicSummaryMetadata = styled.div`
  display: flex;
  align-items: center;

  ${TextTitle} {
    font-size: 1rem;
    padding-right: 4px;
  }
`;

const UIClosingMember = styled.span`
  padding: 0 4px;
  font-weight: 600;
`;

const UITopicSummaryContent = styled.div``;

const UIAdditionalNotes = styled.div``;
