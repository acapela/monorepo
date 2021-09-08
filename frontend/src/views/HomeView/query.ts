import { Room_Bool_Exp } from "~gql";

export function getHomeViewRoomsQueryWhere(userId: string): Room_Bool_Exp {
  return {
    finished_at: { _is_null: true },
    members: { user_id: { _eq: userId } },
  };
}
