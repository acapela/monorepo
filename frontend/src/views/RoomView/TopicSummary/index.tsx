import React, { useState } from "react";
import styled from "styled-components";
import { fontSize } from "~ui/baseStyles";
import { TextArea } from "~ui/forms/TextArea";
import { TextTitle } from "~ui/typo";
import { TopicDetailedInfoFragment } from "~frontend/gql";
import { useTopic } from "~frontend/topics/useTopic";
import { parseDate } from "../RoomSummaryView";

interface Props {
  topic: TopicDetailedInfoFragment;
}

export const TopicSummary = ({ topic }: Props) => {
  const summaryBeforeEdit = topic.closing_summary || "";
  const [summary, setSummary] = useState(summaryBeforeEdit);

  const { loading, updateSummary } = useTopic(topic);

  function submitUpdatedSummary() {
    if (summary.trim() !== summaryBeforeEdit.trim()) {
      updateSummary(summary.trim());
    }
  }

  return (
    <UITopicSummary>
      <UITopicSummaryMetadata>
        <TextTitle>{topic.name}</TextTitle> was closed by{" "}
        <UIClosingMember>{topic.closed_by_user?.name}</UIClosingMember> · {parseDate(topic.closed_at)}
      </UITopicSummaryMetadata>
      <UITopicSummaryContent
        isResizable={true}
        disabled={loading}
        value={summary}
        placeholder={"Type here to write topic outcome..."}
        onChangeText={(value) => setSummary(value)}
        onBlur={submitUpdatedSummary}
      />
    </UITopicSummary>
  );
};

const UITopicSummary = styled.div`
  display: grid;
  gap: 8px;

  min-height: 32px;
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

const UITopicSummaryContent = styled(TextArea)`
  &&& {
    padding: 0;
    border: 0;
  }
`;
