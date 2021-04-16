import React, { useRef } from "react";
import styled from "styled-components";
import { ThreadMessageBasicInfoFragment, useCreateTextMessageMutation } from "~frontend/gql";
import { EmojiPicker } from "~ui/EmojiPicker";
import { Field, useFieldValue } from "~ui/field";

interface Props {
  threadId: string;
  onMessageAdded?: (data: ThreadMessageBasicInfoFragment) => void;
}

export const MessageComposer = ({ threadId, onMessageAdded }: Props) => {
  const [createTextMessage] = useCreateTextMessageMutation();
  const inputRef = useRef<HTMLInputElement>(null);
  const textField = useFieldValue("", inputRef);

  return (
    <UIForm
      onSubmit={async (event) => {
        event.preventDefault();

        if (!textField.value) {
          // TODO: Add proper validation UI
          alert("Message content is required");
        }

        const newMessageResponse = await createTextMessage({
          variables: {
            text: textField.value,
            threadId,
          },
        });

        const newMessage = newMessageResponse.data?.message;

        if (!newMessage) {
          return;
        }

        onMessageAdded?.(newMessage);

        textField.reset();
      }}
    >
      <EmojiPicker
        onPicked={(emoji) => {
          textField.appendAtCursor(emoji);
        }}
      />
      <Field ref={inputRef} placeholder="Write a message" {...textField.bindProps} />
    </UIForm>
  );
};

const UIForm = styled.form`
  display: grid;
  grid-template-columns: 32px 1fr;
  align-items: center;
  grid-gap: 20px;
`;
