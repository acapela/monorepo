import { gql } from "@apollo/client";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useAssertCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import {
  AddSpaceMemberMutation,
  AddSpaceMemberMutationVariables,
  CreateSpaceMutation,
  CreateSpaceMutationVariables,
  DeleteSpaceMutation,
  DeleteSpaceMutationVariables,
  EditSpaceMutation,
  EditSpaceMutationVariables,
  RemoveSpaceMemberMutation,
  RemoveSpaceMemberMutationVariables,
  SingleSpaceQuery,
  SingleSpaceQueryVariables,
  SpaceBasicInfoFragment as SpaceBasicInfoFragmentType,
  SpaceDetailedInfoFragment as SpaceDetailedInfoFragmentType,
  SpaceWithMembersFragment,
  SpacesQuery,
  SpacesQueryVariables,
  TeamSpacesQuery,
  TeamSpacesQueryVariables,
} from "~gql";
import { slugify } from "~shared/slugify";
import { getUUID } from "~shared/uuid";
import { addToast } from "~ui/toasts/data";

import { RoomBasicInfoFragment, RoomDetailedInfoFragment } from "./rooms";
import { TeamDetailedInfoFragment } from "./teams";
import { UserBasicInfoFragment } from "./user";
import { createFragment, createMutation, createQuery, withFragments } from "./utils";
import { getUpdatedDataWithInput } from "./utils/updateWithInput";

export const SpaceBasicInfoFragment = createFragment<SpaceBasicInfoFragmentType>(
  () => gql`
    ${UserBasicInfoFragment()}
    ${RoomBasicInfoFragment()}

    fragment SpaceBasicInfo on space {
      id
      name
      members {
        space_id
        user_id
        user {
          ...UserBasicInfo
        }
      }
    }
  `
);

export const SpaceDetailedInfoFragment = createFragment<SpaceDetailedInfoFragmentType>(
  () => gql`
    ${UserBasicInfoFragment()}
    ${RoomDetailedInfoFragment()}
    ${SpaceBasicInfoFragment()}

    fragment SpaceDetailedInfo on space {
      ...SpaceBasicInfo
      rooms {
        ...RoomDetailedInfo
      }
      team_id
    }
  `
);

export const [useTeamSpacesQuery] = createQuery<TeamSpacesQuery, TeamSpacesQueryVariables>(
  () => gql`
    ${SpaceDetailedInfoFragment()}

    query TeamSpaces($teamId: uuid!) {
      space(where: { team_id: { _eq: $teamId } }) {
        ...SpaceDetailedInfo
      }
    }
  `
);

export const [useSpacesQuery] = createQuery<SpacesQuery, SpacesQueryVariables>(
  () => gql`
    ${SpaceDetailedInfoFragment()}

    query Spaces($where: space_bool_exp!, $limit: Int) {
      space(where: $where, limit: $limit) {
        ...SpaceDetailedInfo
      }
    }
  `
);

export function usePreferredSpaces(limit = 10) {
  const user = useAssertCurrentUser();
  const currentTeamId = useAssertCurrentTeamId();

  const [mySpaces = []] = useSpacesQuery({
    where: { members: { user_id: { _eq: user.id } }, team_id: { _eq: currentTeamId } },
    limit,
  });

  const [otherSpaces = []] = useSpacesQuery({
    where: { members: { user_id: { _neq: user.id } }, team_id: { _eq: currentTeamId } },
    limit,
  });

  return [...mySpaces, ...otherSpaces].slice(0, limit);
}

export const [useSingleSpaceQuery] = createQuery<SingleSpaceQuery, SingleSpaceQueryVariables>(
  () => gql`
    ${SpaceDetailedInfoFragment()}

    query SingleSpace($id: uuid!) {
      space: space_by_pk(id: $id) {
        ...SpaceDetailedInfo
      }
    }
  `
);

export const useIsCurrentUserSpaceMember = withFragments(
  {
    space: gql`
      fragment SpaceWithMembers on space {
        members {
          space_id
          user_id
          user {
            id
          }
        }
      }
    `,
  },
  function useIsCurrentUserSpaceMember(space?: SpaceWithMembersFragment) {
    const user = useAssertCurrentUser();

    return space?.members.some((member) => member.user.id === user.id) ?? false;
  }
);

export const [useCreateSpaceMutation, { mutate: createSpace }] = createMutation<
  CreateSpaceMutation,
  CreateSpaceMutationVariables
>(
  () => gql`
    ${SpaceBasicInfoFragment()}

    mutation CreateSpace($input: space_insert_input!) {
      space: insert_space_one(object: $input) {
        ...SpaceBasicInfo
      }
    }
  `,
  {
    inputMapper({ input }) {
      if (input.name && !input.slug) {
        input.slug = slugify(input.name);
      }
    },
    defaultVariables() {
      return {
        input: {
          id: getUUID(),
        },
      };
    },
    optimisticResponse({ input }) {
      return {
        __typename: "mutation_root",
        space: {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          id: input.id!,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          name: input.name!,
          __typename: "space",
          members: [],
        },
      };
    },
    onOptimisticOrActualResponse(space, { input }) {
      if (!input.team_id) return;

      TeamDetailedInfoFragment.update(input.team_id, (team) => {
        team.spaces.push(space);
      });
    },
  }
);

export const [useEditSpaceMutation] = createMutation<EditSpaceMutation, EditSpaceMutationVariables>(
  () => gql`
    ${SpaceDetailedInfoFragment()}

    mutation EditSpace($spaceId: uuid!, $input: space_set_input!) {
      space: update_space_by_pk(pk_columns: { id: $spaceId }, _set: $input) {
        ...SpaceDetailedInfo
      }
    }
  `,
  {
    inputMapper({ input }) {
      if (input.name && !input.slug) {
        input.slug = slugify(input.name);
      }
    },
    optimisticResponse({ spaceId, input }) {
      const space = SpaceDetailedInfoFragment.assertRead(spaceId);
      const newData = getUpdatedDataWithInput(space, input);

      return {
        __typename: "mutation_root",
        space: newData,
      };
    },
  }
);

export const [useDeleteSpaceMutation, { mutate: deleteSpace }] = createMutation<
  DeleteSpaceMutation,
  DeleteSpaceMutationVariables
>(
  () => gql`
    ${SpaceDetailedInfoFragment()}

    mutation DeleteSpace($spaceId: uuid!) {
      deletedSpace: delete_space_by_pk(id: $spaceId) {
        ...SpaceDetailedInfo
      }
    }
  `,
  {
    optimisticResponse(variables) {
      const space = SpaceDetailedInfoFragment.assertRead(variables.spaceId);

      return {
        __typename: "mutation_root",
        deletedSpace: space,
      };
    },
    onOptimisticOrActualResponse(deletedSpace) {
      TeamDetailedInfoFragment.update(deletedSpace.team_id, (team) => {
        team.spaces = team.spaces.filter((space) => space.id !== deletedSpace.id);
      });
    },
  }
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
    optimisticResponse(vars) {
      return {
        __typename: "mutation_root",
        insert_space_member_one: {
          space_id: vars.spaceId,
          user_id: vars.userId,
        },
      };
    },
    onOptimisticOrActualResponse(data, variables) {
      SpaceBasicInfoFragment.update(variables.spaceId, (space) => {
        space.members.push({
          __typename: "space_member",
          user: UserBasicInfoFragment.assertRead(variables.userId),
          user_id: variables.userId,
          space_id: variables.spaceId,
        });
      });
    },
    onActualResponse() {
      addToast({ type: "success", title: `Space member was added` });
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
    optimisticResponse() {
      return {
        __typename: "mutation_root",
        delete_space_member: {
          __typename: "space_member_mutation_response",
          affected_rows: 1,
        },
      };
    },
    onOptimisticOrActualResponse(data, variables) {
      SpaceBasicInfoFragment.update(variables.spaceId, (space) => {
        space.members = space.members.filter((member) => member.user.id !== variables.userId);
      });
    },
    onActualResponse() {
      addToast({ type: "success", title: `Space member was removed` });
    },
  }
);
