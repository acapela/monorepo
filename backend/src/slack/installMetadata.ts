export type InstallMetadata = { teamId?: string; userId?: string; redirectURL?: string };

/**
 * When getting a Slack OAuth installation URL, one can supply metadata which Slack will
 * send back after installation. We use that for two purposes:
 * - persisting the installation based on a given team/user
 * - redirecting the user back to where they came from
 */

export function parseMetadata({ metadata }: { metadata?: string }): InstallMetadata {
  return metadata ? JSON.parse(metadata) : {};
}
