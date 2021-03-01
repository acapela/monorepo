import { gql } from "@apollo/client";
import classNames from "classnames";
import { format } from "date-fns";
import { Field as FormikField, Form, Formik } from "formik";
import { motion } from "framer-motion";
import React from "react";
import { useCurrentUser } from "../authentication/authentication";
import { Avatar } from "../design/Avatar";
import { Field, FieldType } from "../design/Field";
import {
  RoomDetailedInfoFragment,
  ThreadMessageBasicInfoFragment,
  useCreateTextMessageMutation,
  useThreadMessagesSubscription,
} from "../gql";

gql`
  fragment ThreadMessageBasicInfo on message {
    id
    text
    createdAt: created_at
    user {
      id
      name
      avatarUrl: avatar_url
    }
  }
`;

interface MessageWithUserInfo extends ThreadMessageBasicInfoFragment {
  isOwnMessage: boolean;
}

gql`
  subscription ThreadMessages($threadId: uuid!) {
    messages: message(where: { thread_id: { _eq: $threadId } }, order_by: [{ created_at: asc }]) {
      ...ThreadMessageBasicInfo
    }
  }
`;

gql`
  mutation CreateTextMessage($text: String!, $threadId: uuid!) {
    message: insert_message_one(object: { text: $text, thread_id: $threadId, type: TEXT }) {
      ...ThreadMessageBasicInfo
    }
  }
`;

const useThreadMessages = (threadId: string): { loading: boolean; messages: MessageWithUserInfo[] } => {
  const { loading: loadingUser, user } = useCurrentUser();
  const { data, loading: loadingMessages } = useThreadMessagesSubscription({ variables: { threadId } });

  if (loadingUser || loadingMessages) {
    return { loading: true, messages: [] };
  }
  return {
    loading: false,
    messages: data.messages?.map((message) => ({ ...message, isOwnMessage: message.user.id === user.id })),
  };
};

export const Thread: React.FC<{ id: string; room: RoomDetailedInfoFragment }> = ({ id }) => {
  const { loading, messages } = useThreadMessages(id);
  return (
    <div className="relative h-full">
      <div className="absolute w-full overflow-auto top-0 bottom-11">
        {!loading && (
          <motion.div
            className="flex flex-col space-y-2"
            variants={{
              show: { transition: { staggerChildren: 0.04 } },
            }}
            initial="hidden"
            animate="show"
          >
            {messages.map((message) => (
              <TextMessage key={message.id} message={message} />
            ))}
            {!messages.length && (
              <div className="max-w-md mx-auto">Start the conversation and add your first message below.</div>
            )}
          </motion.div>
        )}
      </div>
      <div className="absolute w-full bottom-0">
        <Composer threadId={id} />
      </div>
    </div>
  );
};

const TextMessage: React.FC<{ message: MessageWithUserInfo }> = ({ message }) => {
  return (
    <motion.div
      className={classNames("flex", { "self-end": message.isOwnMessage })}
      variants={{
        hidden: {
          opacity: 0,
          y: 20,
        },
        show: {
          opacity: 1,
          y: 0,
        },
      }}
    >
      <div
        className={classNames(
          "rounded-lg py-2 px-3 w-auto inline-flex space-x-2",
          message.isOwnMessage ? "flex-row-reverse space-x-reverse bg-blue-50" : "bg-gray-100"
        )}
      >
        <Avatar
          url={message.user.avatarUrl}
          name={message.user.name || "Guest"}
          className="w-14 h-14 flex-shrink-0 border-gray-100"
        />
        <div>
          <div className={classNames("mt-1", { "text-right": message.isOwnMessage })}>
            <span className="font-bold">{message.isOwnMessage ? "You" : message.user.name} </span>
            <span className="font-semibold text-sm text-gray-400">· {format(new Date(message.createdAt), "p")}</span>
          </div>
          {message.text}
        </div>
      </div>
    </motion.div>
  );
};

const Composer: React.FC<{ threadId: string }> = ({ threadId }) => {
  const [createTextMessage] = useCreateTextMessageMutation();
  return (
    <Formik
      initialValues={{ text: "" }}
      // TODO: validate
      onSubmit={async (values, context) => {
        await createTextMessage({
          variables: {
            text: values.text,
            threadId,
          },
        });
        context.resetForm();
      }}
    >
      {() => (
        <Form>
          <FormikField name="text">
            {({ field }) => <Field id="text-input" type={FieldType.TEXT} {...field} placeholder="Write a message" />}
          </FormikField>
        </Form>
      )}
    </Formik>
  );
};
