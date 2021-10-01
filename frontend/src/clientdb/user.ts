import gql from "graphql-tag";

import { defineEntity } from "~clientdb";
import { EntityByDefinition } from "~clientdb/entity/entity";
import { createMutation, createQuery } from "~frontend/gql/utils";
import {
  PushUpdateUserMutation,
  PushUpdateUserMutationVariables,
  UpdatedUsersQuery,
  UpdatedUsersQueryVariables,
  UserFragment,
  User_Set_Input,
} from "~gql";

import { taskEntity } from "./task";
import { getFragmentKeys } from "./utils/getFragmentKeys";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";

const userFragment = gql`
  fragment User on user {
    id
    name
    email
    avatar_url
    updated_at
  }
`;

const [, { subscribe: subscribeToUserUpdates }] = createQuery<UpdatedUsersQuery, UpdatedUsersQueryVariables>(
  () => gql`
    ${userFragment}

    query UpdatedUsers($lastSyncDate: timestamptz) {
      user(where: { updated_at: { _gt: $lastSyncDate } }) {
        ...User
      }
    }
  `
);

const [, { mutate: updateUser }] = createMutation<PushUpdateUserMutation, PushUpdateUserMutationVariables>(
  () => gql`
    ${userFragment}
    mutation PushUpdateUser($id: uuid!, $input: user_set_input!) {
      update_user_by_pk(pk_columns: { id: $id }, _set: $input) {
        ...User
      }
    }
  `
);

function convertChangedDataToInput({ avatar_url, name }: Partial<UserFragment>): User_Set_Input {
  return { avatar_url, name };
}

export const userEntity = defineEntity<UserFragment>({
  name: "user",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<UserFragment>(userFragment),
  getDefaultValues() {
    return {
      __typename: "user",
      ...getGenericDefaultData(),
    };
  },
  sync: {
    pull({ lastSyncDate, updateItems }) {
      return subscribeToUserUpdates({ lastSyncDate: lastSyncDate.toISOString() }, (newData) => {
        updateItems(newData.user);
      });
    },
    async push(task) {
      const result = await updateUser({ id: task.id, input: convertChangedDataToInput(task) });

      return result[0] ?? false;
    },
  },
}).addConnections((user, { getEntity }) => {
  return {
    get tasks() {
      return getEntity(taskEntity).query((task) => task.user_id === user.id);
    },
  };
});

export type UserEntity = EntityByDefinition<typeof userEntity>;
