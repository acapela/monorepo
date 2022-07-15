import { db } from "@aca/db";
import { logger } from "@aca/shared/logger";

type OutdatedUser = {
  user_id: string;
  email: string;
  latest_resolved_at: string;
};

type OutdatedLinearIssue = {
  organization_id: string;
};

export async function userCleanup() {
  const outdatedUsers =
    (await db.$queryRaw`SELECT user_id, email, latest_resolved_at FROM (SELECT user_id, MAX(resolved_at) latest_resolved_at FROM public.notification GROUP BY user_id) as nr JOIN public.user ON id = nr.user_id WHERE latest_resolved_at < NOW() - INTERVAL '10 days' OR latest_resolved_at IS NULL;`) as OutdatedUser[];
  for (const outdatedUser of outdatedUsers) {
    logger.info(`Deleting user ${outdatedUser.user_id}`);
    try {
      await db.user.delete({ where: { id: outdatedUser.user_id } });
      await db.deleted_user.create({ data: { email: outdatedUser.email } });
    } catch (e) {
      logger.warn(`Failed to delete user ${outdatedUser.user_id}`, e);
    }
  }
  const outdatedLinearIssues =
    (await db.$queryRaw`SELECT DISTINCT organization_id FROM public.linear_issue WHERE organization_id NOT IN (SELECT linear_organization_id FROM public.linear_oauth_token);`) as OutdatedLinearIssue[];

  for (const outdatedLinearIssue of outdatedLinearIssues) {
    logger.info(`Deleting issues for organization ${outdatedLinearIssue.organization_id}`);
    try {
      await db.linear_issue.deleteMany({ where: { id: outdatedLinearIssue.organization_id } });
    } catch (e) {
      logger.warn(`Failed to delete issues for organization ${outdatedLinearIssue.organization_id}`, e);
    }
  }

  await db.$executeRaw`DELETE FROM public.notification WHERE updated_at < NOW() - INTERVAL '30 days' AND resolved_at IS NOT NULL;`;
}
