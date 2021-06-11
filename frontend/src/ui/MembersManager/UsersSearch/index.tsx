import React from "react";
import { UserBasicInfoFragment } from "~frontend/gql";

interface Props {
  users: UserBasicInfoFragment[];
  onSelect: (userId: string) => void;
}

export const UsersSearch = ({ users }: Props) => {
  return <p>UsersSearch will be here: {users.length}</p>;
};
