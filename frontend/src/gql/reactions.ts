import { gql } from "@apollo/client";

import { ReactionBasicInfoFragment as ReactionBasicInfoFragmentType } from "~gql";

import { UserBasicInfoFragment } from "./user";
import { createFragment } from "./utils";

export const ReactionBasicInfoFragment = createFragment<ReactionBasicInfoFragmentType>(
  () => gql`
    ${UserBasicInfoFragment()}

    fragment ReactionBasicInfo on message_reaction {
      emoji
      user {
        ...UserBasicInfo
      }
    }
  `
);
