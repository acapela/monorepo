import produce from "immer";
import { ReactNode, useState } from "react";
import { useAssertCurrentTeamId } from "~frontend/authentication/useCurrentUser";
import {
  RoomsQueryVariables,
  Room_Bool_Exp as RoomWhere,
  Room_Order_By as RoomOrder,
  UserBasicInfoFragment,
} from "~gql";

export interface BasicFilter {
  key: string;
  label?: string;
  icon?: ReactNode;
  whereApplier?: (draft: RoomWhere) => void;
  orderGetter?: () => RoomOrder;
}

export interface UserFilter extends BasicFilter {
  type: "user";
  user: UserBasicInfoFragment;
}

export function getIsUserFilter(filter: BasicFilter): filter is UserFilter {
  return Reflect.get(filter, "type") === "user";
}

export type RoomFilter = UserFilter | BasicFilter;

const DEFAULT_RECENT_ROOMS_LIMIT = 100;

export function getRoomVariablesFromFilters(teamId: string, filters: RoomFilter[]): RoomsQueryVariables {
  const orders: RoomOrder[] = [];
  let where: RoomWhere = {
    space: {
      team_id: { _eq: teamId },
    },
  };

  for (const filter of filters) {
    if (filter.orderGetter) {
      const order = filter.orderGetter();
      orders.push(order);
    }

    if (filter.whereApplier) {
      where = produce(where, (draft) => {
        filter.whereApplier?.(draft);

        return draft;
      });
    }
  }

  // If there is no other orders, by default let's order by the latest messages.
  if (!orders.length) {
    orders.push({
      last_posted_message: {
        last_posted_message_time: "desc",
      },
    });
  }

  return {
    where,
    orderBy: orders,
    limit: DEFAULT_RECENT_ROOMS_LIMIT,
  };
}

export function useRoomFilterVariables(forcedFilters?: RoomFilter[]) {
  const [filters, setFilters] = useState<RoomFilter[]>([]);
  const teamId = useAssertCurrentTeamId();

  const variables = getRoomVariablesFromFilters(teamId, [...filters, ...(forcedFilters ?? [])]);

  return [variables, setFilters] as const;
}
