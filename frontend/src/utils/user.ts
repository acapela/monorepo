import { UserBasicInfoFragment } from "~gql";
import { UserAuthData } from "~frontend/authentication/useCurrentUser";

export function convertUserAuthToBasicFragment({ id, name, email, picture }: UserAuthData): UserBasicInfoFragment {
  return {
    id,
    name,
    email,
    avatar_url: picture,
  };
}
