import { gql } from "@apollo/client";

import {
  CreateSpaceMutation,
  CreateSpaceMutationVariables,
  SpaceBasicInfoFragment as SpaceBasicInfoFragmentType,
} from "~gql";
import { slugify } from "~shared/slugify";
import { getUUID } from "~shared/uuid";

import { RoomBasicInfoFragment } from "./rooms";
import { TeamDetailedInfoFragment } from "./teams";
import { UserBasicInfoFragment } from "./user";
import { createFragment, createMutation } from "./utils";

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
