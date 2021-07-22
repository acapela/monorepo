import React from "react";
import { UserBasicInfoFragment } from "~gql";
import { createPromiseUI } from "~ui/createPromiseUI";
import { UserPickerModal } from "./UserPickerModal";

interface PromptInput {
  currentUsers: UserBasicInfoFragment[];
  onAddUser: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
  asyncResolveRequest?: Promise<void>;
}

type PromptResult = void;

export const openUserPickerModal = createPromiseUI<PromptInput, PromptResult>(
  ({ currentUsers, onAddUser, onRemoveUser, asyncResolveRequest }, resolve) => {
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
