import { gql, useMutation, useSubscription } from "@apollo/client";
import classNames from "classnames";
import { Formik, Form, Field as FormikField } from "formik";
import React, { useEffect, useRef } from "react";
import { format } from "date-fns";
import { Avatar } from "../design/Avatar";
import { Field, FieldType } from "../design/Field";
import { Room, User } from "../rooms/Room";
import { useCurrentUser } from "../authentication/authentication";
import { AnimatePresence, motion } from "framer-motion";

const MESSAGE_SUBSCRIPTION = gql`
  subscription ThreadMessages($threadId: uuid!) {
    messages: message(where: { thread_id: { _eq: $threadId } }, order_by: [{ created_at: asc }]) {
      id
      text
      createdAt: created_at
      user {
        id
        name
        avatarUrl: avatar_url
      }
    }
  }
`;

const CREATE_TEXT_MESSAGE = gql`
  mutation CreateTextMessage($text: String!, $threadId: uuid!) {
    message: insert_message_one(object: { text: $text, thread_id: $threadId, type: TEXT }) {
      id
      text
      createdAt: created_at
      user {
        id
        name
        avatarUrl: avatar_url
      }
    }
  }
`;

const useThreadMessages = (threadId: string): { loading: boolean; messages: TextMessage[] } => {
  const { loading: loadingUser, user } = useCurrentUser();
  const { data: { messages = [] } = {}, loading: loadingMessages } = useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { threadId },
  });
  if (loadingUser || loadingMessages) {
    return { loading: true, messages: [] };
  }
  return {
    loading: false,
    messages: messages.map((message) => ({ ...message, isOwnMessage: message.user.id === user.id })),
  };
};

export const Thread: React.FC<{ id: string; room: Room }> = ({ id }) => {
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

interface TextMessage {
  id: string;
  text: string;
  createdAt: string;
  user: User;
  isOwnMessage: boolean;
}

const TextMessage: React.FC<{ message: TextMessage }> = ({ message }) => {
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
  const [createTextMessage] = useMutation(CREATE_TEXT_MESSAGE);
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
