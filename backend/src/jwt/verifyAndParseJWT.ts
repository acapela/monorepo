import jwt from "jsonwebtoken";
import { UserTokenData } from "~shared/types/jwtAuth";

export function verifyAndParseJWT<AssumedData>(token: string) {
  const parsedData = jwt.verify(token, process.env.AUTH_JWT_TOKEN_SECRET, { algorithms: ["HS256"] });

  return parsedData as AssumedData;
}

export function verifyAndParseUserJWT(token: string) {
  return verifyAndParseJWT<UserTokenData>(token);
}
