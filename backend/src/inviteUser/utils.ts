import { createJWT, signJWT } from "~shared/jwt";
import { routes } from "~shared/routes";

export const getInviteURL = (userId: string, extraFields?: object) =>
  `${process.env.FRONTEND_URL}${routes.invite}?${new URLSearchParams(
    Object.entries({
      jwt: signJWT(createJWT({ userId })),
      ...extraFields,
    })
  )}`;
