import { ActionHandler } from "@aca/backend/src/actions/actionHandlers";
import { db } from "@aca/db";
import { GitHubInstallation } from "@aca/gql";
import { assert } from "@aca/shared/assert";

export const githubInstallations: ActionHandler<void, GitHubInstallation[]> = {
  actionName: "github_installations",

  async handle(userId) {
    assert(userId, "missing userId");
    const installationIds = await db.github_account_to_installation.findMany({
      where: {
        user_id: userId,
      },
    });
    const installations = await db.github_installation.findMany({
      where: {
        id: {
          in: installationIds.map((i) => i.installation_id),
        },
      },
    });

    return installations.map((i) => ({
      id: i.id,
      name: i.account_login,
      isOrg: i.target_type === "Organization",
    })) as GitHubInstallation[];
  },
};
