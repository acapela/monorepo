import { useCreateTextMessageMutation } from "@acapela/frontend/gql";
import { Field, useFieldValue } from "@acapela/ui/field";
import { gql } from "@apollo/client";
import React from "react";

gql`
  mutation CreateTextMessage($text: String!, $threadId: uuid!) {
    message: insert_message_one(object: { text: $text, thread_id: $threadId, type: TEXT }) {
      ...ThreadMessageBasicInfo
    }
  }
`;

export const MessageComposer: React.FC<{ threadId: string }> = ({ threadId }) => {
  const [createTextMessage] = useCreateTextMessageMutation();
  const textField = useFieldValue("");

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();

        await createTextMessage({
          variables: {
            text: textField.value,
            threadId,
          },
        });

        textField.reset();
      }}
    >
      <Field placeholder="Write a message" {...textField.bindProps} />
    </form>
  );
};
