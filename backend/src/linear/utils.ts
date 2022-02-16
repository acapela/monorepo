import { LinearClient } from "@linear/sdk";

import { LinearOauthToken, db } from "@aca/db";

export function getRandomLinearClient(usersForOrg: LinearOauthToken[]): LinearClient {
  // pick a random token to access linear api
  const randomUserToken = usersForOrg[Math.floor(usersForOrg.length * Math.random())].access_token;
  return new LinearClient({
    accessToken: randomUserToken,
  });
}

export async function getUsersForOrganizationId(id: string, notifyOnly?: string[]): Promise<LinearOauthToken[]> {
  return db.linear_oauth_token.findMany({
    where: {
      linear_organization_id: id,
      ...(notifyOnly
        ? {
            linear_user_id: {
              in: notifyOnly,
            },
          }
        : {}),
    },
  });
}
