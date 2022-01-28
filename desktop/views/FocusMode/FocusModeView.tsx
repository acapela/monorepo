import { observer } from "mobx-react";
import React from "react";

import { BrowserViewBridge, PreloadBrowserView } from "@aca/desktop/BrowserViewBridge";
import { useDb } from "@aca/desktop/clientdb/ClientDbProvider";
import { useUnresolvedNotifications } from "@aca/desktop/hooks/useUnresolvedNotifications";
import { desktopRouter } from "@aca/desktop/routes";
import { Button } from "@aca/ui/buttons/Button";

export const FocusModeView = observer(({ notificationId }: { notificationId: string }) => {
  const db = useDb();
  const currentNotification = db.notification.assertFindById(notificationId);

  const unresolvedNotifications = useUnresolvedNotifications();
  const currentIndex = unresolvedNotifications.findIndex((n) => n.id === notificationId);

  // We limit the amount of notifications to preload to the previous one and the next 3
  const notificationsToPreload = unresolvedNotifications.slice(Math.max(currentIndex - 1, 0), currentIndex + 3);

  return (
    <div>
      {currentIndex !== -1 &&
        notificationsToPreload.map((notification) => (
          <PreloadBrowserView key={notification.id} url={notification.url} />
        ))}
      <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
        <Button
          disabled={currentIndex <= 0}
          onClick={() =>
            desktopRouter.navigate("focus", { notificationId: unresolvedNotifications[currentIndex - 1].id })
          }
        >
          Previous
        </Button>
        <Button onClick={() => desktopRouter.navigate("list", { listId: "inbox" })}>Back to List</Button>
        <Button
          disabled={currentIndex == -1 || currentIndex >= unresolvedNotifications.length - 1}
          onClick={() =>
            desktopRouter.navigate("focus", { notificationId: unresolvedNotifications[currentIndex + 1].id })
          }
        >
          Next
        </Button>
      </div>
      <BrowserViewBridge url={currentNotification.url} />
    </div>
  );
});
