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

    db.user_slack_channels_by_team.update({
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
    db.user_slack_channels_by_team.update({
      where: { id: event.item.id },
      data: { are_all_channels_included: doesContainPlaceholder },
    });
  }
}
