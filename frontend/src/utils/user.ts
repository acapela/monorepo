import { UserTokenData } from "~shared/types/jwtAuth";
import { UserBasicInfoFragment } from "~gql";

export function convertUserAuthToBasicFragment({ id, name, email, picture }: UserTokenData): UserBasicInfoFragment {
  return {
    __typename: "user",
    id,
    name,
    email,
    avatar_url: picture,
  };
}
