import produce from "immer";
import { ReactNode } from "react";
import {
  Order_By,
  RecentTopicsQueryVariables,
  Topic_Bool_Exp as TopicWhere,
  Topic_Bool_Exp,
  Topic_Order_By as TopicOrder,
  Topic_Order_By,
  UserBasicInfoFragment,
} from "~frontend/gql/generated";

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

export type RecentTopicsFilter = UserFilter | BasicFilter;

export function getRecentTopicVariablesFromFilters(
  userId: string,
  teamId: string,
  filters: RecentTopicsFilter[]
): RecentTopicsQueryVariables {
  const orders: Topic_Order_By[] = [];
  let where: Topic_Bool_Exp = {
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
      // where =
    }
  }

  if (!orders.length) {
    orders.push({ messages_aggregate: { max: { created_at: Order_By.Desc } } });
  }

  return {
    where,
    orderBy: orders,
    limit: 50,
  };
}
