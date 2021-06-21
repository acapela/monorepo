import React from "react";
import { IconFilter } from "~ui/icons";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { UserBasicInfoFragment } from "~gql";
import { BasicFilter, UserFilter } from "./filter";

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

export function createOpenRoomFilter(isOpen: boolean): BasicFilter {
  return {
    key: "open-room-filter",
    whereApplier(where) {
      if (!where.finished_at) where.finished_at = {};
      where.finished_at = {
        _is_null: isOpen,
      };
    },
  };
}
