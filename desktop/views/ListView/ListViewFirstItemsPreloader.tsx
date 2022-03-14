import { observer } from "mobx-react";
import React from "react";

import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { PreloadNotificationPreview } from "@aca/desktop/domains/notification/NotificationPreview";
import { PreviewLoadingPriority } from "@aca/desktop/domains/preview";
import { uiStore } from "@aca/desktop/store/ui";
import { useDebouncedValue } from "@aca/shared/hooks/useDebouncedValue";

interface Props {
  list: NotificationsList;
}

export const ListViewFirstItemsPreloader = observer(({ list }: Props) => {
  const hasSettledFocusedTarget = useDebouncedValue(!!uiStore.focusedTarget, 100);

  return (
    <>
      {!hasSettledFocusedTarget &&
        list.getNotificationsToPreload().map((notificationToPreload, index) => {
          return (
            <PreloadNotificationPreview
              priority={index === 0 ? PreviewLoadingPriority.next : PreviewLoadingPriority.following}
              key={notificationToPreload.id}
              url={notificationToPreload.url}
            />
          );
        })}
    </>
  );
});
