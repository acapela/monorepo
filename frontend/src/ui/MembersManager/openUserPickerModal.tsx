import React from "react";
import { UserBasicInfoFragment } from "~gql";
import { useSingleRoomQuery } from "~frontend/gql/rooms";
import { useSingleSpaceQuery } from "~frontend/gql/spaces";
import { createPromiseUI } from "~ui/createPromiseUI";
import { UserPickerModal } from "./UserPickerModal";

type PlaceOfMembership = "space" | "room";

interface PromptInput {
  id: string;
  placeOfMembership: PlaceOfMembership;
  onAddUser: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
  asyncResolveRequest?: Promise<void>;
}

type PromptResult = void;

export const openUserPickerModal = createPromiseUI<PromptInput, PromptResult>(
  ({ id, placeOfMembership, onAddUser, onRemoveUser, asyncResolveRequest }, resolve) => {
    const currentUsers = useMembers(id, placeOfMembership);

    if (asyncResolveRequest) {
      asyncResolveRequest.then(resolve);
    }

    return (
      <UserPickerModal
        currentUsers={currentUsers}
        onCloseRequest={resolve}
        onAddUser={onAddUser}
        onRemoveUser={onRemoveUser}
      />
    );
  }
);

function useMembers(id: string, placeOfMembership: PlaceOfMembership): UserBasicInfoFragment[] {
  if (placeOfMembership === "space") {
    const [space] = useSingleSpaceQuery({ id });
    return space?.members.map((m) => m.user) ?? [];
  }
  if (placeOfMembership === "room") {
    const [room] = useSingleRoomQuery({ id });
    return room?.members.map((m) => m.user) ?? [];
  }
  return [];
}
