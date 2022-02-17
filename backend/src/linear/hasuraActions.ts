import { LinearClient } from "@linear/sdk";

import { ActionHandler } from "@aca/backend/src/actions/actionHandlers";
import { db } from "@aca/db";
import { ServiceUser } from "@aca/gql";
import { assert } from "@aca/shared/assert";

export const linearUsers: ActionHandler<void, ServiceUser[]> = {
  actionName: "linear_users",

  async handle(userId) {
    assert(userId, "missing userId");
    const linearOauthToken = await db.linear_oauth_token.findFirst({ where: { user_id: userId } });
    if (!linearOauthToken) {
      return [];
    }
    const linearClient = new LinearClient({ accessToken: linearOauthToken.access_token });
    const users = await linearClient.users();

    return users.nodes.map((user) => ({
      id: user.id,
      display_name: user.displayName,
      real_name: user.name,
      avatar_url: user.avatarUrl ?? null,
    })) as ServiceUser[];
  },
};
