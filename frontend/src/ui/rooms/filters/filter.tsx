import { sortBy } from "lodash";
import { ReactNode } from "react";
import { useList } from "react-use";

import { RoomDetailedInfoFragment, UserBasicInfoFragment } from "~gql";
import { isNotNullish } from "~shared/nullish";

export type RoomCriteria = {
  key: string;
  label?: string;
  icon?: ReactNode;
  filter?: (room: RoomDetailedInfoFragment) => boolean;
  sorter?: (roomA: RoomDetailedInfoFragment) => string | number | Date | null;
};

export interface UserRoomCriteria extends RoomCriteria {
  user: UserBasicInfoFragment;
}

export function getIsUserRoomCriteria(criteria: RoomCriteria): criteria is UserRoomCriteria {
  return !!Reflect.get(criteria, "user");
}

export function getUsersFromRoomCriteriaList(criteria: RoomCriteria[]): UserBasicInfoFragment[] {
  return criteria.filter(getIsUserRoomCriteria).map((criteria) => criteria.user);
}

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

export function useRoomsCriteria(unfilteredRooms: RoomDetailedInfoFragment[], forcedCriteria: RoomCriteria[] = []) {
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
