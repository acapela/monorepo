import React, { useRef } from "react";
import styled from "styled-components";
import { useCreateTextMessageMutation } from "~frontend/gql";
import { EmojiPicker } from "~ui/EmojiPicker";
import { Field, useFieldValue } from "~ui/field";
import { FileUpload } from "~frontend/views/thread/FileUpload";

export const MessageComposer: React.FC<{ threadId: string }> = ({ threadId }) => {
  const [createTextMessage] = useCreateTextMessageMutation();
  const inputRef = useRef<HTMLInputElement>(null);
  const textField = useFieldValue("", inputRef);

  return (
    <>
      <UIForm
        onSubmit={async (event) => {
          event.preventDefault();

          if (!textField.value) {
            // TODO: Add proper validation UI
            alert("Message content is required");
          }

          await createTextMessage({
            variables: {
              text: textField.value,
              threadId,
            },
          });

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
      <div>
        <FileUpload />
        <FileUpload />
      </div>
    </>
  );
};

const UIForm = styled.form`
  display: grid;
  grid-template-columns: 32px 1fr;
  align-items: center;
  grid-gap: 20px;
`;
