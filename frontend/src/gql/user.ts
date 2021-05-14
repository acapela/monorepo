import { gql } from "@apollo/client";

export const UserBasicInfoFragment = () => gql`
  fragment UserBasicInfo on user {
    id
    name
    avatar_url
  }
`;
