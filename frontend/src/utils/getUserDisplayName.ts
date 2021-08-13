import { UserBasicInfoFragment } from "~gql";

export const getUserDisplayName = (user: UserBasicInfoFragment) => user.name ?? user.email ?? "Unknown user";
