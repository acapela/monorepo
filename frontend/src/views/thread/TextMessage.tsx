import { Avatar } from "@acapela/frontend/design/Avatar";
import { ThreadMessageBasicInfoFragment } from "@acapela/frontend/gql";
import classNames from "classnames";
import { format } from "date-fns";
import { motion } from "framer-motion";
import React from "react";

interface MessageWithUserInfo extends ThreadMessageBasicInfoFragment {
  isOwnMessage: boolean;
}

export const TextMessage: React.FC<{ message: MessageWithUserInfo }> = ({ message }) => {
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
            <span className="font-bold">{message.isOwnMessage ? "You" : message.user.name}</span>
            &nbsp;
            <span className="font-semibold text-sm text-gray-400">
              ·&nbsp;
              {format(new Date(message.createdAt), "p")}
            </span>
          </div>
          {message.text}
        </div>
      </div>
    </motion.div>
  );
};
