import { db } from "@aca/db";

import { BOT_USER_ID } from "./botUser";

export async function ensureBotIsTeamMember(teamId: string) {
  return await db.team_member.upsert({
    create: { user_id: BOT_USER_ID, team_id: teamId },
    update: {},
    where: { team_id_user_id: { team_id: teamId, user_id: BOT_USER_ID } },
  });
}
