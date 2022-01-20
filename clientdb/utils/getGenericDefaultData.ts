import { getUUID } from "@aca/shared/uuid";

export function getGenericDefaultData() {
  const nowTime = Date.now();

  return {
    id: getUUID(),
    created_at: new Date(nowTime).toISOString(),
    updated_at: new Date(nowTime).toISOString(),
  };
}
