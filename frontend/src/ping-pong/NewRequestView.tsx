import React, { useState } from "react";
import styled, { css } from "styled-components";

import { useBoolean } from "~frontend/../../shared/hooks/useBoolean";
import { EditableText } from "~ui/forms/EditableText";

import { SidebarLayout } from "./Layout";
import { SidebarContent } from "./sidebar/SidebarContent";

const PLACEHOLDER_TOPIC_NAME = "Add topic";

export function NewRequestView() {
  const [topicName, setTopicName] = useState<string>(PLACEHOLDER_TOPIC_NAME);
  const [isEditingTopicName, { set: setEditTopicName, unset: unsetEditTopicName }] = useBoolean(false);

  function startEditingTopicName() {
    if (topicName === PLACEHOLDER_TOPIC_NAME) {
      setTopicName("");
    }
    setEditTopicName();
  }

  function handleSubmitTopicName(submittedTopicName: string) {
    if (submittedTopicName.trim().length === 0) {
      setTopicName(PLACEHOLDER_TOPIC_NAME);
    } else {
      setTopicName(submittedTopicName.trim());
    }
    unsetEditTopicName();
  }

  return (
    <SidebarLayout sidebarContent={<SidebarContent />}>
      <UIHolder>
        <UITopicNameHolder onClick={startEditingTopicName}>
          <UIEditableText
            isDisplayingPlaceholder={PLACEHOLDER_TOPIC_NAME === topicName}
            value={topicName}
            isInEditMode={isEditingTopicName}
            focusSelectMode={"cursor-at-end"}
            onValueSubmit={handleSubmitTopicName}
          />
        </UITopicNameHolder>
      </UIHolder>
    </SidebarLayout>
  );
}

const UIHolder = styled.div<{}>``;

const UITopicNameHolder = styled.div<{}>`
  width: 600px;
`;

const UIEditableText = styled(EditableText)<{ isDisplayingPlaceholder: boolean }>`
  font-weight: 700;
  font-family: "Inter", sans-serif;

  font-size: 24px;

  ${(props) =>
    props.isDisplayingPlaceholder &&
    css`
      color: rgba(0, 0, 0, 0.2);
    `}
`;
