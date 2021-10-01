import { getUUID } from "~shared/uuid";

export function getGenericDefaultData() {
  return {
    id: getUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
