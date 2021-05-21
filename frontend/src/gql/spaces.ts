import { gql } from "@apollo/client";
import {
  CreateSpaceMutation,
  CreateSpaceMutationVariables,
  GetSpacesQuery,
  GetSpacesQueryVariables,
  GetSingleSpaceQuery,
  GetSingleSpaceQueryVariables,
  AddSpaceMemberMutation,
  AddSpaceMemberMutationVariables,
  RemoveSpaceMemberMutation,
  RemoveSpaceMemberMutationVariables,
} from "./generated";
import { RoomBasicInfoFragment, RoomDetailedInfoFragment } from "./rooms";
import { UserBasicInfoFragment } from "./user";

import { createMutation, createQuery } from "./utils";

export const SpaceBasicInfoFragment = () => gql`
  ${UserBasicInfoFragment()}
  ${RoomBasicInfoFragment()}

  fragment SpaceBasicInfo on space {
    id
    name
    members {
      user {
        ...UserBasicInfo
      }
    }
  }
`;

export const SpaceDetailedInfoFragment = () => gql`
  ${UserBasicInfoFragment()}
  ${RoomDetailedInfoFragment()}

  fragment SpaceDetailedInfo on space {
    id
    name
    members {
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

    query GetSpaces($teamId: uuid!) {
      space(where: { team_id: { _eq: $teamId } }) {
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

    mutation CreateSpace($name: String!, $teamId: uuid!, $slug: String!) {
      space: insert_space_one(object: { name: $name, team_id: $teamId, slug: $slug }) {
        ...SpaceBasicInfo
      }
    }
  `,
  {
    onSuccess(data, { teamId }) {
      getSpacesQueryManager.update({ teamId }, (draft) => {
        if (!data.space) return;

        draft.space.push(data.space);
      });
    },
  }
);

export const [useAddSpaceMember] = createMutation<AddSpaceMemberMutation, AddSpaceMemberMutationVariables>(
  () => gql`
    mutation AddSpaceMember($spaceId: uuid!, $userId: uuid!) {
      insert_space_member_one(object: { space_id: $spaceId, user_id: $userId }) {
        space_id
        user_id
      }
    }
  `
);

export const [useRemoveSpaceMember] = createMutation<RemoveSpaceMemberMutation, RemoveSpaceMemberMutationVariables>(
  () => gql`
    mutation RemoveSpaceMember($spaceId: uuid!, $userId: uuid!) {
      delete_space_member(where: { space_id: { _eq: $spaceId }, user_id: { _eq: $userId } }) {
        affected_rows
      }
    }
  `
);
