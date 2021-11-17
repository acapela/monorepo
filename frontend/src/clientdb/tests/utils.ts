import { getUUID } from "~frontend/../../shared/uuid";

import { ClientDb } from "..";

export async function makeUser(db: ClientDb) {
  const id = getUUID();
  return db.user.create({
    email: `${id}@acape.la`,
    name: `UID=>${id}`,
    id,
    avatar_url: null,
    has_account: true,
  });
}
