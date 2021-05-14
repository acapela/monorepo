import { gql } from "@apollo/client";
import {
  CreateSpaceMutation,
  CreateSpaceMutationVariables,
  GetSpacesQuery,
  GetSpacesQueryVariables,
  GetSingleSpaceQuery,
  GetSingleSpaceQueryVariables,
} from "./generated";
import { RoomBasicInfoFragment, RoomDetailedInfoFragment } from "./rooms";
import { UserBasicInfoFragment } from "./user";

import { createMutation, createQuery } from "./utils";

const SpaceBasicInfoFragment = () => gql`
  ${UserBasicInfoFragment()}
  ${RoomBasicInfoFragment()}

  fragment SpaceBasicInfo on space {
    id
    name
    participants {
      user {
        ...UserBasicInfo
      }
    }
  }
`;

const SpaceDetailedInfoFragment = () => gql`
  ${UserBasicInfoFragment()}
  ${RoomDetailedInfoFragment()}

  fragment SpaceDetailedInfo on space {
    id
    name
    participants {
      user {
        ...UserBasicInfo
      }
    }
    rooms {
      ...RoomDetailedInfo
    }
  }
`;

export const [useGetSpacesQuery, getSpacesQueryManager] = createQuery<GetSpacesQuery, GetSpacesQueryVariables>(
  () => gql`
    ${SpaceBasicInfoFragment()}

    query GetSpaces {
      space {
        ...SpaceBasicInfo
      }
    }
  `
);

export const [useGetSingleSpaceQuery, getSingleSpaceManager] = createQuery<
  GetSingleSpaceQuery,
  GetSingleSpaceQueryVariables
>(
  () => gql`
    ${SpaceDetailedInfoFragment()}

    query GetSingleSpace($id: uuid!) {
      space: space_by_pk(id: $id) {
        ...SpaceDetailedInfo
      }
    }
  `
);

export const [useCreateSpaceMutation] = createMutation<CreateSpaceMutation, CreateSpaceMutationVariables>(
  () => gql`
    ${SpaceBasicInfoFragment()}

    mutation CreateSpace($name: String!) {
      space: insert_space_one(object: { name: $name }) {
        ...SpaceBasicInfo
      }
    }
  `,
  {
    onSuccess(data, variables) {
      getSpacesQueryManager.update({}, (draft) => {
        if (!data.space) return;

        draft.space.push(data.space);
      });
    },
  }
);
