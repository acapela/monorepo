import React, { useState } from "react";
import styled from "styled-components";
import { Button, TransparentButton } from "~ui/button";
import { TextTitle } from "~ui/typo";
import { Modal } from "~frontend/ui/Modal";
import { TextArea } from "~ui/forms/TextArea";

interface Props {
  topicId: string;
  loading: boolean;
  onDismissRequested: () => void;
  onTopicClosed: (summary: string) => void;
}

export const CloseTopicModal = ({ onDismissRequested, onTopicClosed, loading }: Props) => {
  const [topicSummary, setTopicSummary] = useState("");

  async function closeWithSummary() {
    onTopicClosed(topicSummary);
    onDismissRequested();
  }

  async function closeWithoutSummary() {
    onTopicClosed("");
    onDismissRequested();
  }

  return (
    <Modal hasCloseButton={false} onCloseRequest={onDismissRequested}>
      <UIBody>
        <UITitle>Almost there 🎉</UITitle>
        <UIBodyText>
          Briefly highlight the outcome of this Topic.
          <br />
          Your team will appreciate it.
        </UIBodyText>
        <UITextArea
          placeholder={"Type here..."}
          value={topicSummary}
          onChangeText={(value) => setTopicSummary(value)}
        />
        <UIButtons>
          <TransparentButton isLoading={loading} onClick={closeWithoutSummary}>
            Skip
          </TransparentButton>
          <Button isLoading={loading} onClick={closeWithSummary}>
            Share
          </Button>
        </UIButtons>
      </UIBody>
    </Modal>
  );
};

const UIBody = styled.div`
  width: 480px;
  padding: 8px 24px;
  align-items: center;
  text-align: center;
`;

const UITitle = styled(TextTitle)`
  font-size: 2rem;
  padding-bottom: 16px;
`;

const UIBodyText = styled.div`
  font-weight: 400;
  line-height: 1.5;
  font-size: 0.75rem;
  padding-bottom: 32px;
`;

const UITextArea = styled(TextArea)`
  margin-bottom: 32px;
  background-color: hsla(0, 0%, 97%, 1);
  font-size: 0.75rem;
`;

const UIButtons = styled.div`
  display: flex;
  justify-content: flex-end;

  ${Button} {
    margin-left: 8px;
  }
`;
