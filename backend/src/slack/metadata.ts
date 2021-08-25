import * as SlackBolt from "@slack/bolt";

export type Metadata = { teamId: string; redirectURL?: string; userId?: string };

export function parseMetadata({ metadata }: SlackBolt.Installation): Metadata {
  if (!metadata) {
    throw new Error("Missing metadata");
  }
  return JSON.parse(metadata);
}
