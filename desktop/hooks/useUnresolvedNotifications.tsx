import { useDb } from "@aca/desktop/clientdb/ClientDbProvider";

export function useUnresolvedNotifications() {
  const db = useDb();
  const unresolvedNotifications = db.notification.query({ resolved_at: null }).all;
  return unresolvedNotifications.filter((notification) => notification.inner);
}
