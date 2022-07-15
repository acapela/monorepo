import { db } from "@aca/db";
import { logger } from "@aca/shared/logger";

type TOutdatedUser = {
  user_id: string;
  email: string;
  latest_resolved_at: string;
};

export async function userCleanup() {
  const outdatedUsers =
    (await db.$queryRaw`SELECT user_id, email, latest_resolved_at FROM (SELECT user_id, MAX(resolved_at) latest_resolved_at FROM public.notification GROUP BY user_id) as nr JOIN public.user ON id = nr.user_id WHERE latest_resolved_at < NOW() - INTERVAL '10 days' OR latest_resolved_at IS NULL;`) as TOutdatedUser[];
  for (const outdatedUser of outdatedUsers) {
    logger.info(`Deleting user ${outdatedUser.user_id}`);
    try {
      await db.user.delete({ where: { id: outdatedUser.user_id } });
      await db.deleted_user.create({ data: { email: outdatedUser.email } });
    } catch (e) {
      logger.warn(`Failed to delete user ${outdatedUser.user_id}`, e);
    }
  }
}
