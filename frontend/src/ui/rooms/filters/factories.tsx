import React from "react";

import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { getUserDisplayName } from "~frontend/utils/getUserDisplayName";
import { UserBasicInfoFragment } from "~gql";
import { IconFilter } from "~ui/icons";

import { RoomCriteria, UserRoomCriteria } from "./filter";

export function createUserFilter(user: UserBasicInfoFragment): UserRoomCriteria {
  return {
    key: `user-${user.id}`,
    label: getUserDisplayName(user),
    icon: <UserAvatar user={user} size="small" />,
    filter(room) {
      return room.members.some((member) => member.user.id === user.id);
    },
    user,
  };
}

export function createSortByLatestActivityFilter(): RoomCriteria {
  return {
    key: "latest-activity",
    label: "Sort by latest activity",
    icon: <IconFilter />,
    sorter(room) {
      if (!room.last_activity_at) {
        return null;
      }

      return new Date(room.last_activity_at);
    },
  };
}

export function createSortByDueDateFilter(): RoomCriteria {
  return {
    key: "due-date",
    label: "Sort by due date",
    icon: <IconFilter />,
    sorter(room) {
      if (!room.deadline) return null;

      return new Date(room.deadline);
    },
  };
}

export function createOpenRoomFilter(requestIsOpen: boolean): RoomCriteria {
  return {
    key: "open-room-filter",
    filter(room) {
      const isOpen = !!room.finished_at;

      return isOpen === requestIsOpen;
    },
  };
}

export function createSpaceFilter(spaceId: string): RoomCriteria {
  return {
    key: "space-filter",
    filter(room) {
      return room.space_id === spaceId;
    },
  };
}
