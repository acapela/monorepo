import { gql } from "@apollo/client";
import {
  CreateSpaceMutation,
  CreateSpaceMutationVariables,
  GetSpacesQuery,
  GetSpacesQueryVariables,
  GetSingleSpaceQuery,
  GetSingleSpaceQueryVariables,
} from "./generated";
import { UserBasicInfoFragment } from "./user";

import { createMutation, createQuery } from "./utils";

const SpaceBasicInfoFragment = gql`
  ${UserBasicInfoFragment}

  fragment SpaceBasicInfo on space {
    id
    name
    participants {
      user {
        ...UserBasicInfo
      }
    }
    rooms {
      room {
        id
        name
      }
    }
  }
`;

export const [useGetSpacesQuery] = createQuery<GetSpacesQuery, GetSpacesQueryVariables>(gql`
  ${SpaceBasicInfoFragment}

  query GetSpaces {
    space {
      ...SpaceBasicInfo
    }
  }
`);

export const [useGetSingleSpaceQuery] = createQuery<GetSingleSpaceQuery, GetSingleSpaceQueryVariables>(gql`
  ${SpaceBasicInfoFragment}

  query GetSingleSpace($id: uuid!) {
    space: space_by_pk(id: $id) {
      ...SpaceBasicInfo
    }
  }
`);

export const [useCreateSpaceMutation] = createMutation<CreateSpaceMutation, CreateSpaceMutationVariables>(gql`
  ${SpaceBasicInfoFragment}

  mutation CreateSpace($name: String!) {
    space: insert_space_one(object: { name: $name }) {
      ...SpaceBasicInfo
    }
  }
`);
