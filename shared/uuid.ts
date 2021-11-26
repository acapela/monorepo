import { v4 as uuid } from "uuid";

import { assert } from "~shared/assert";

export function getUUID() {
  return uuid();
}

/**
 * UUID handle has format of:
 *
 * any-human-familiar-part-<UUID-WITHOUT-DASHES>
 *
 */

const UUID_REGEXP = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;
const DASHLESS_UUID_REGEXP = /\b[0-9a-f]{32}\b/;

function getIsUUID(maybeUUID: string) {
  return UUID_REGEXP.test(maybeUUID);
}

function getIsDashlessUUID(maybeDashlessUUID: string) {
  return DASHLESS_UUID_REGEXP.test(maybeDashlessUUID);
}

/**
 * a76437c5-af1b-4337-84ae-2432c15f9a51 > a76437c5af1b433784ae2432c15f9a51
 */
export function removeDashesFromUUID(uuid: string) {
  assert(getIsUUID(uuid), "Not uuid, cannot remove dashes");

  return uuid.replaceAll("-", "");
}

/**
 * a76437c5af1b433784ae2432c15f9a51 > a76437c5-af1b-4337-84ae-2432c15f9a51
 */
function addDashesToDashlessUUID(dashlessUUID: string) {
  assert(getIsDashlessUUID(dashlessUUID), "Not dashless uuid, cannot add dashes");

  return [
    dashlessUUID.substr(0, 8),
    dashlessUUID.substr(8, 4),
    dashlessUUID.substr(12, 4),
    dashlessUUID.substr(16, 4),
    dashlessUUID.substr(20, 12),
  ].join("-");
}

/**
 * Will create human readable version that includes both slug and uuid in form of
 * slug-part-UUID_WITHOUT_DASHES
 */
export function createUUIDHandle(uuid: string, slugPart: string) {
  return `${slugPart}-${removeDashesFromUUID(uuid)}`;
}

/**
 * Gets UUID (with dashes from handle in format)
 * any-human-familiar-part-<UUID-WITHOUT-DASHES>
 */
export function getUUIDFromUrlHandle(handle: string) {
  const handleSegments = handle.split("-");
  const possiblyDashlessUUID = handleSegments[handleSegments.length - 1];

  if (!getIsDashlessUUID(possiblyDashlessUUID)) return null;

  return addDashesToDashlessUUID(possiblyDashlessUUID);
}
