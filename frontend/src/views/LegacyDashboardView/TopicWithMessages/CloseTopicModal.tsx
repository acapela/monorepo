import React, { useState } from "react";
import styled from "styled-components";

import { Modal } from "~frontend/ui/Modal";
import { Button } from "~ui/buttons/Button";
import { TextArea } from "~ui/forms/TextArea";
import { HStack } from "~ui/Stack";
import { TextH3 } from "~ui/typo";

interface Props {
  topicId: string;
  loading: boolean;
  onDismissRequest: () => void;
  onTopicClosed: (summary: string) => void;
}

export const CloseTopicModal = ({ onDismissRequest, onTopicClosed, loading }: Props) => {
  const [topicSummary, setTopicSummary] = useState("");

  async function closeWithSummary() {
    onTopicClosed(topicSummary);
    onDismissRequest();
  }

  async function closeWithoutSummary() {
    onTopicClosed("");
    onDismissRequest();
  }

  return (
    <Modal onCloseRequest={onDismissRequest}>
      <UIBody>
        <UITitle>Almost there 🎉</UITitle>
        <UIBodyText>
          Briefly highlight the outcome of this Topic.
          <br />
          Your team will appreciate it.
        </UIBodyText>
        <UITextArea
          autoFocus
          placeholder={"Topic summary..."}
          value={topicSummary}
          onChangeText={(value) => setTopicSummary(value)}
        />
        <UIButtons justifyContent="space-around">
          <UIButtonsSection justifyContent="end" gap={8}>
            <Button kind="transparent" isLoading={loading} onClick={closeWithoutSummary}>
              Close without summary
            </Button>
            <Button isLoading={loading} onClick={closeWithSummary}>
              Submit
            </Button>
          </UIButtonsSection>
        </UIButtons>
      </UIBody>
    </Modal>
  );
};

const UIBody = styled.div<{}>`
  width: 480px;
  padding: 8px 24px;
  align-items: center;
  text-align: center;
`;

const UITitle = styled(TextH3)<{}>`
  padding-bottom: 16px;
`;

const UIBodyText = styled.div<{}>`
  font-weight: 400;
  line-height: 1.5;
  padding-bottom: 32px;
`;

const UITextArea = styled(TextArea)<{}>`
  margin-bottom: 32px;
  background-color: hsla(0, 0%, 97%, 1);
  height: 72px;
`;

const UIButtons = styled(HStack)<{}>``;

const UIButtonsSection = styled(HStack)<{}>`
  flex-grow: 1;
`;
