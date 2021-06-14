import produce from "immer";
import { ReactNode, useState } from "react";
import { IconFilter } from "~ui/icons";
import { useAssertCurrentTeamId, useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import {
  Order_By,
  TopicsQueryVariables,
  Topic_Bool_Exp as TopicWhere,
  Topic_Order_By as TopicOrder,
  UserBasicInfoFragment,
} from "~gql";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";

export interface BasicFilter {
  label: string;
  icon?: ReactNode;
  whereApplier?: (draft: TopicWhere) => void;
  orderGetter?: () => TopicOrder;
}

interface UserFilter extends BasicFilter {
  type: "user";
  user: UserBasicInfoFragment;
}

export type TopicFilter = UserFilter | BasicFilter;

const DEFAULT_RECENT_TOPICS_COUNT = 100;

export function getTopicVariablesFromFilters(
  userId: string,
  teamId: string,
  filters: TopicFilter[]
): TopicsQueryVariables {
  const orders: TopicOrder[] = [];
  let where: TopicWhere = {
    room: {
      space: {
        team_id: { _eq: teamId },
      },
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
    orders.push({ messages_aggregate: { max: { created_at: Order_By.Desc } } });
  }

  return {
    where,
    orderBy: orders,
    limit: DEFAULT_RECENT_TOPICS_COUNT,
  };
}

export function useTopicFilterVariables() {
  const [filters, setFilters] = useState<TopicFilter[]>([]);
  const teamId = useAssertCurrentTeamId();
  const user = useAssertCurrentUser();

  const variables = getTopicVariablesFromFilters(user.id, teamId, filters);

  return [variables, setFilters] as const;
}

export function createUserFilter(user: UserBasicInfoFragment): UserFilter {
  return {
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
    label: "Sort by latest activity",
    icon: <IconFilter />,
    orderGetter() {
      return { messages_aggregate: { max: { created_at: Order_By.Desc } } };
    },
  };
}

export function createSortByDueDateFilter(): BasicFilter {
  return {
    label: "Sort by due date",
    icon: <IconFilter />,
    orderGetter() {
      return { room: { deadline: Order_By.Desc } };
    },
  };
}
