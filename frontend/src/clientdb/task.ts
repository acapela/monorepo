import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "~clientdb";
import { teamInvitationEntity } from "~frontend/clientdb/teamInvitation";
import { TaskFragment } from "~gql";

import { messageEntity } from "./message";
import { userEntity } from "./user";
import { getFragmentKeys } from "./utils/analyzeFragment";
import { userIdContext } from "./utils/context";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "./utils/sync";

const taskFragment = gql`
  fragment Task on task {
    id
    message_id
    user_id
    created_at
    done_at
    seen_at
    type
    updated_at
    due_at
    team_invitation {
      id
    }
  }
`;

export const taskEntity = defineEntity<TaskFragment>({
  name: "task",
  keyField: "id",
  updatedAtField: "updated_at",
  getDefaultValues() {
    return {
      __typename: "task",
      done_at: null,
      seen_at: null,
      due_at: null,
      team_invitation_id: null,
      ...getGenericDefaultData(),
    };
  },
  keys: getFragmentKeys<TaskFragment>(taskFragment),
  sync: createHasuraSyncSetupFromFragment<TaskFragment>(taskFragment, {
    insertColumns: ["done_at", "due_at", "user_id", "seen_at", "type", "message_id", "id"],
    updateColumns: ["done_at", "due_at", "seen_at"],
  }),
}).addConnections((task, { getEntity, getContextValue }) => {
  return {
    get message() {
      return getEntity(messageEntity).findById(task.message_id);
    },
    get user() {
      if (!task.user_id) {
        return null;
      }

      return getEntity(userEntity).findById(task.user_id);
    },
    get isOwn() {
      return task.user_id === getContextValue(userIdContext);
    },
    get teamInvitation() {
      if (!task.team_invitation?.id) return null;
      return getEntity(teamInvitationEntity).findById(task.team_invitation.id);
    },
  };
});

export type TaskEntity = EntityByDefinition<typeof taskEntity>;
