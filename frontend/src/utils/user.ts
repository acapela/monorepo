import { UserBasicInfoFragment } from "~gql";
import { UserTokenData } from "~shared/types/jwtAuth";

export function convertUserAuthToBasicFragment({ id, name, email, picture }: UserTokenData): UserBasicInfoFragment {
  return {
    __typename: "user",
    id,
    name,
    email,
    avatar_url: picture,
  };
}
