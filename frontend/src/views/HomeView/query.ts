import { ValueUpdater } from "~frontend/../../shared/updateValue";
import { readUserDataFromCookie } from "~frontend/authentication/cookie";
import { roomsQueryManager } from "~frontend/gql/rooms";
import { RoomsQuery, Room_Bool_Exp } from "~gql";

export function getHomeViewRoomsQueryWhere(userId: string): Room_Bool_Exp {
  return {
    finished_at: { _is_null: true },
    members: { user_id: { _eq: userId } },
  };
}

export function updateHomeviewQuery(updater: ValueUpdater<RoomsQuery>) {
  const user = readUserDataFromCookie();

  if (!user) return;

  const homeViewQuery = getHomeViewRoomsQueryWhere(user.id);

  roomsQueryManager.update({ where: homeViewQuery }, updater);
}
