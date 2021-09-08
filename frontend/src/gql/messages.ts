import { gql } from "@apollo/client";

import {
  MessageBasicInfoFragment as MessageBasicInfoFragmentType,
  MessageDetailedInfoFragment as MessageDetailedInfoFragmentType,
  MessageFeedInfoFragment as MessageFeedInfoFragmentType,
} from "~gql";

import { AttachmentDetailedInfoFragment } from "./attachments";
import { ReactionBasicInfoFragment } from "./reactions";
import { TaskBasicInfoFragment } from "./tasks";
import { UserBasicInfoFragment } from "./user";
import { createFragment } from "./utils";

export const MessageBasicInfoFragment = createFragment<MessageBasicInfoFragmentType>(
  () => gql`
    ${UserBasicInfoFragment()}
    fragment MessageBasicInfo on message {
      id
      createdAt: created_at
      content
      type
      user {
        ...UserBasicInfo
      }
    }
  `
);

export const MessageDetailedInfoFragment = createFragment<MessageDetailedInfoFragmentType>(
  () => gql`
    ${MessageBasicInfoFragment()}
    ${AttachmentDetailedInfoFragment()}
    ${ReactionBasicInfoFragment()}
    ${TaskBasicInfoFragment()}

    fragment MessageDetailedInfo on message {
      ...MessageBasicInfo

      message_attachments {
        ...AttachmentDetailedInfo
      }
      message_reactions {
        ...ReactionBasicInfo
      }

      tasks {
        ...TaskBasicInfo
      }
    }
  `
);

export const MessageFeedInfoFragment = createFragment<MessageFeedInfoFragmentType>(
  () => gql`
    ${MessageDetailedInfoFragment()}

    fragment MessageFeedInfo on message {
      ...MessageDetailedInfo
      replied_to_message {
        ...MessageDetailedInfo
      }
    }
  `
);
