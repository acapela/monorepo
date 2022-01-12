import { createJWT, signJWT } from "@aca/shared/jwt";
import { routes } from "@aca/shared/routes";

export const getInviteURL = (userId: string, extraFields?: object) =>
  `${process.env.FRONTEND_URL}${routes.invite}?${new URLSearchParams(
    Object.entries({
      jwt: signJWT(createJWT({ userId })),
      ...extraFields,
    })
  )}`;
