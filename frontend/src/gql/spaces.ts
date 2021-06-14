import { gql } from "@apollo/client";
import { addToast } from "~ui/toasts/data";
import {
  CreateSpaceMutation,
  CreateSpaceMutationVariables,
  SpacesQuery,
  SpacesQueryVariables,
  SingleSpaceQuery,
  SingleSpaceQueryVariables,
  AddSpaceMemberMutation,
  AddSpaceMemberMutationVariables,
  RemoveSpaceMemberMutation,
  RemoveSpaceMemberMutationVariables,
  EditSpaceMutation,
  EditSpaceMutationVariables,
  DeleteSpaceMutation,
  DeleteSpaceMutationVariables,
} from "~gql";
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

export const [useSpacesQuery, spacesQueryManager] = createQuery<SpacesQuery, SpacesQueryVariables>(
  () => gql`
    ${SpaceBasicInfoFragment()}

    query Spaces($teamId: uuid!) {
      space(where: { team_id: { _eq: $teamId } }) {
        ...SpaceBasicInfo
      }
    }
  `
);

export const [useSingleSpaceQuery, singleSpaceQueryManager] = createQuery<SingleSpaceQuery, SingleSpaceQueryVariables>(
  () => gql`
    ${SpaceDetailedInfoFragment()}

    query SingleSpace($id: uuid!) {
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
    onSuccess(space, { teamId }) {
      spacesQueryManager.update({ teamId }, (draft) => {
        if (!space) return;

        draft.space.push(space);
      });
    },
  }
);

export const [useEditSpaceMutation] = createMutation<EditSpaceMutation, EditSpaceMutationVariables>(
  () => gql`
    ${SpaceBasicInfoFragment()}

    mutation EditSpace($name: String!, $spaceId: uuid!) {
      space: update_space_by_pk(pk_columns: { id: $spaceId }, _set: { name: $name }) {
        ...SpaceBasicInfo
      }
    }
  `
);

export const [useDeleteSpaceMutation, { mutate: deleteSpace }] = createMutation<
  DeleteSpaceMutation,
  DeleteSpaceMutationVariables
>(
  () => gql`
    ${SpaceBasicInfoFragment()}

    mutation DeleteSpace($spaceId: uuid!) {
      deletedSpace: delete_space_by_pk(id: $spaceId) {
        ...SpaceBasicInfo
      }
    }
  `
);

export const [useAddSpaceMemberMutation] = createMutation<AddSpaceMemberMutation, AddSpaceMemberMutationVariables>(
  () => gql`
    mutation AddSpaceMember($spaceId: uuid!, $userId: uuid!) {
      insert_space_member_one(object: { space_id: $spaceId, user_id: $userId }) {
        space_id
        user_id
      }
    }
  `,
  {
    onSuccess() {
      addToast({ type: "info", content: `Space member was added` });
    },
  }
);

export const [useRemoveSpaceMemberMutation] = createMutation<
  RemoveSpaceMemberMutation,
  RemoveSpaceMemberMutationVariables
>(
  () => gql`
    mutation RemoveSpaceMember($spaceId: uuid!, $userId: uuid!) {
      delete_space_member(where: { space_id: { _eq: $spaceId }, user_id: { _eq: $userId } }) {
        affected_rows
      }
    }
  `,
  {
    onSuccess() {
      addToast({ type: "info", content: `Space member was removed` });
    },
  }
);
