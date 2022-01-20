import { createClientDb } from "@aca/clientdb";
import { createPersistanceAdapterMock } from "@aca/clientdb/tests/utils";
import { apolloContext, teamIdContext, userIdContext } from "@aca/clientdb/utils/context";

import { appClientDbEntities } from "../createNewClientDb";

export function createTestAppClientDb(userId: string, teamId: string) {
  const clientdb = createClientDb(
    {
      db: createPersistanceAdapterMock(),
      contexts: [
        userIdContext.create(userId),
        teamIdContext.create(teamId),
        // We have sync disabled so apollo client will never be used
        // TODO: this is a bit hacky, tho
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        apolloContext.create(null as unknown as any),
      ],
      disableSync: true,
    },
    appClientDbEntities
  );

  return clientdb;
}

export async function createTestAppClientDbWithData() {
  const userId = "main-user";
  const teamId = "current-team";

  const db = await createTestAppClientDb(userId, teamId);

  const team = db.team.create({ id: teamId, name: "Test team", slug: "test-team", owner_id: userId });
  const currentUser = db.user.create({
    email: "me@acape.la",
    name: "Acapela user",
    id: userId,
    avatar_url: null,
    has_account: true,
  });
  const teamMembership = db.teamMember.create({
    has_joined: true,
    user_id: userId,
    team_id: teamId,
    notify_email: false,
    notify_slack: false,
  });

  const data = {
    team,
    currentUser,
    teamMembership,
  };

  return [db, data] as const;
}
