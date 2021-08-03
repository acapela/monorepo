import { sortBy } from "lodash";
import { ReactNode } from "react";
import { isNotNullish } from "~shared/nullish";
import { RoomDetailedInfoFragment } from "~gql";
import { useList } from "react-use";

export type RoomCriteria = {
  key: string;
  label?: string;
  icon?: ReactNode;
  filter?: (room: RoomDetailedInfoFragment) => boolean;
  sorter?: (roomA: RoomDetailedInfoFragment) => string | number | Date | null;
};

const DEFAULT_RECENT_ROOMS_LIMIT = 100;

export function filterAndSortRoomsByRoomCriteria(
  rooms: RoomDetailedInfoFragment[],
  criteria: RoomCriteria[]
): RoomDetailedInfoFragment[] {
  const filteredRooms = rooms.filter((room) => {
    for (const singleCriteria of criteria) {
      if (!singleCriteria.filter) continue;

      if (singleCriteria.filter(room) === false) {
        return false;
      }
    }
    return true;
  });

  const sorters = criteria.map((filter) => filter.sorter).filter(isNotNullish);

  const sortedRooms = sortBy(filteredRooms, ...sorters);

  return sortedRooms;
}

export function useRoomsCriteria(unfilteredRooms: RoomDetailedInfoFragment[], forcedCriteria?: RoomCriteria[] = []) {
  const [addedCriteria, { push: addCriteria, filter, set: setCriteria }] = useList<RoomCriteria>();

  function removeCriteria(criteria: RoomCriteria) {
    filter((existingCriteria) => existingCriteria.key !== criteria.key);
  }

  const filteredRooms = filterAndSortRoomsByRoomCriteria(unfilteredRooms, [...forcedCriteria, ...addedCriteria]);

  const manager = {
    addedCriteria,
    setCriteria,
    addCriteria,
    removeCriteria,
  };
  return [filteredRooms, manager] as const;
}
