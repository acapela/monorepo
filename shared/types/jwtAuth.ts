/**
 * We are passing custom data to session JWT token, so we have more data than default next-auth Session type.
 */
export interface UserTokenData {
  email: string;
  iat: number;
  name: string;
  picture: string | null;
  sub: string;
  id: string;
  currentTeamId: string | null;
}
