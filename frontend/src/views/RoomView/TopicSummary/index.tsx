import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { withFragments } from "~frontend/gql/utils";
import { TopicSummary_TopicFragment, UpdateTopicSummaryMutation, UpdateTopicSummaryMutationVariables } from "~gql";
import { fontSize } from "~ui/baseStyles";
import { TextArea } from "~ui/forms/TextArea";
import { theme } from "~ui/theme";
import { ColorModifiers } from "~ui/theme/colors/createColor";

import { formatDate } from "../shared";

const fragments = {
  topic: gql`
    fragment TopicSummary_topic on topic {
      id
      name
      closing_summary
      closed_at
      closed_by_user {
        name
      }
    }
  `,
};

interface Props {
  topic: TopicSummary_TopicFragment;
}

export const TopicSummary = withFragments(fragments, ({ topic }: Props) => {
  const summaryBeforeEdit = topic.closing_summary || "";
  const [summary, setSummary] = useState(summaryBeforeEdit);

  const [updateTopicSummary, { loading }] = useMutation<
    UpdateTopicSummaryMutation,
    UpdateTopicSummaryMutationVariables
  >(
    gql`
      mutation UpdateTopicSummary($id: uuid!, $closingSummary: String!) {
        topic: update_topic_by_pk(pk_columns: { id: $id }, _set: { closing_summary: $closingSummary }) {
          id
          closing_summary
        }
      }
    `,
    {
      optimisticResponse: (vars) => ({
        __typename: "mutation_root",
        topic: { __typename: "topic", id: vars.id, closing_summary: vars.closingSummary },
      }),
    }
  );

  function submitUpdatedSummary() {
    if (summary.trim() !== summaryBeforeEdit.trim()) {
      updateTopicSummary({ variables: { id: topic.id, closingSummary: summary.trim() } });
      trackEvent("Updated Topic Summary", { topicId: topic.id });
    }
  }

  return (
    <UITopicSummary>
      <UITopicSummaryMetadata>
        <UITopicName>{topic.name}</UITopicName>
        <UITopicClosingInfo>
          {" "}
          was closed by <UIClosingMember>{topic.closed_by_user?.name}</UIClosingMember> · {formatDate(topic.closed_at)}
        </UITopicClosingInfo>
      </UITopicSummaryMetadata>
      <UITopicSummaryContent
        isResizable={true}
        disabled={loading}
        value={summary}
        placeholder={"Type here to write topic outcome..."}
        onChangeText={setSummary}
        onBlur={submitUpdatedSummary}
      />
    </UITopicSummary>
  );
});

const UITopicSummary = styled.div<{}>`
  display: grid;
  gap: 8px;

  min-height: 32px;
  width: 100%;

  padding: 8px 16px;

  border-left: 3px solid ${theme.colors.interactive.active((modifiers) => [modifiers.opacity(0.4)])};

  font-size: ${fontSize.label};
  font-weight: 400;
  line-height: 1.5;
`;

const UITopicSummaryMetadata = styled.div<{}>`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const UITopicName = styled.span<{}>`
  ${theme.font.body14.inter.semibold.build}
`;

const UITopicClosingInfo = styled.span<{}>`
  color: ${theme.colors.layout.supportingText()};
  ${theme.font.body12.inter.build};
`;

const UIClosingMember = styled.span<{}>`
  ${theme.font.medium.build}
`;

const UITopicSummaryContent = styled(TextArea)<{}>`
  &&& {
    padding: 0;
    border: 0;
    border-radius: 0px;
  }
`;
