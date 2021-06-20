import produce from "immer";
import { ReactNode, useState } from "react";
import { IconFilter } from "~ui/icons";
import { useAssertCurrentTeamId, useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import {
  RoomsQueryVariables,
  Room_Bool_Exp as RoomWhere,
  Room_Order_By as RoomOrder,
  UserBasicInfoFragment,
} from "~gql";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";

export interface BasicFilter {
  key: string;
  label: string;
  icon?: ReactNode;
  whereApplier?: (draft: RoomWhere) => void;
  orderGetter?: () => RoomOrder;
}

interface UserFilter extends BasicFilter {
  type: "user";
  user: UserBasicInfoFragment;
}

export function getIsUserFilter(filter: BasicFilter): filter is UserFilter {
  return Reflect.get(filter, "type") === "user";
}

export type RoomFilter = UserFilter | BasicFilter;

const DEFAULT_RECENT_ROOMS_LIMIT = 100;

export function getRoomVariablesFromFilters(
  userId: string,
  teamId: string,
  filters: RoomFilter[]
): RoomsQueryVariables {
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

export function useRoomFilterVariables() {
  const [filters, setFilters] = useState<RoomFilter[]>([]);
  const teamId = useAssertCurrentTeamId();
  const user = useAssertCurrentUser();

  const variables = getRoomVariablesFromFilters(user.id, teamId, filters);

  return [variables, setFilters] as const;
}

export function createUserFilter(user: UserBasicInfoFragment): UserFilter {
  return {
    key: `user-${user.id}`,
    type: "user",
    user,
    label: user.name ?? "Unknown user",
    icon: <UserAvatar user={user} size="small" />,
    whereApplier(where) {
      if (!where.members) where.members = {};
      if (!where.members._or) where.members._or = [];
      where.members._or.push({ user_id: { _eq: user.id } });
    },
  };
}

export function createSortByLatestActivityFilter(): BasicFilter {
  return {
    key: "latest-activity",
    label: "Sort by latest activity",
    icon: <IconFilter />,
    orderGetter() {
      return {
        last_posted_message: {
          last_posted_message_time: "desc",
        },
      };
    },
  };
}

export function createSortByDueDateFilter(): BasicFilter {
  return {
    key: "due-date",
    label: "Sort by due date",
    icon: <IconFilter />,
    orderGetter() {
      return { deadline: "asc" };
    },
  };
}
