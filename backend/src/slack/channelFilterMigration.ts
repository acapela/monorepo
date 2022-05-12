// TODO: Temporary Migration! This event should be removed once all users upgraded their App to use the new
// "are_all_channels_included" column in "user_slack_channels_by_team". Migration should probably be done by July 2022.
// Remember to remove it from Hasura as well!

import { HasuraEvent } from "@aca/backend/src/hasura";
import { UserSlackChannelsByTeam, db } from "@aca/db";
import { Prisma } from "@aca/db";
import { USER_ALL_CHANNELS_INCLUDED_PLACEHOLDER } from "@aca/shared/slack";

const jsonIncludesString = (jsonB: Prisma.JsonValue, incString: string) =>
  Array.isArray(jsonB) && jsonB.includes(incString);

// Sync the new and old are_all_channels_included systems to allow a smooth migration.
export async function handleChannelFilterMigrationSync(event: HasuraEvent<UserSlackChannelsByTeam>) {
  const didAreAllChannelsIncludedChange =
    event.itemBefore?.are_all_channels_included !== event.item.are_all_channels_included;

  // Prioritize changes to the new implementation and overwrite the old one (in case both changed)
  if (didAreAllChannelsIncludedChange) {
    const isPlaceholderIncluded = jsonIncludesString(
      event.item.included_channels,
      USER_ALL_CHANNELS_INCLUDED_PLACEHOLDER
    );

    if (
      (isPlaceholderIncluded && event.item.are_all_channels_included) ||
      (!isPlaceholderIncluded && !event.item.are_all_channels_included)
    ) {
      // Values already synced, nothing to do here
      return;
    }

    if (!Array.isArray(event.item.included_channels)) {
      // This should never happen, but handle it just in case
      db.user_slack_channels_by_team.update({
        where: { id: event.item.id },
        data: {
          included_channels: event.item.are_all_channels_included ? [USER_ALL_CHANNELS_INCLUDED_PLACEHOLDER] : [],
        },
      });

      return;
    }

    // Add or remove placeholder based on value of new implementation column
    const included_channels = event.item.are_all_channels_included
      ? [...event.item.included_channels, USER_ALL_CHANNELS_INCLUDED_PLACEHOLDER]
      : event.item.included_channels.filter((c) => c !== USER_ALL_CHANNELS_INCLUDED_PLACEHOLDER);

    await db.user_slack_channels_by_team.update({
      where: { id: event.item.id },
      data: { included_channels },
    });
    return;
  }

  // New implementation didn't change, check old one
  const doesContainPlaceholder = jsonIncludesString(
    event.item.included_channels,
    USER_ALL_CHANNELS_INCLUDED_PLACEHOLDER
  );

  if (
    !event.itemBefore ||
    jsonIncludesString(event.itemBefore.included_channels, USER_ALL_CHANNELS_INCLUDED_PLACEHOLDER) !==
      doesContainPlaceholder
  ) {
    if (
      (event.item.are_all_channels_included && doesContainPlaceholder) ||
      (!event.item.are_all_channels_included && !doesContainPlaceholder)
    ) {
      // Values already synced, nothing to do here
      return;
    }

    // Presence of placeholder changed, set new column accordingly
    await db.user_slack_channels_by_team.update({
      where: { id: event.item.id },
      data: { are_all_channels_included: doesContainPlaceholder },
    });
  }
}
