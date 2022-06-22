import { makeAutoObservable, makeObservable, observable, runInAction } from "mobx";

import { cachedComputed } from "@aca/clientdb";
import { applicationWideSettingsBridge } from "@aca/desktop/bridge/system";
import { getNullableDb } from "@aca/desktop/clientdb";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { animationStore } from "@aca/desktop/domains/embed/animationStore";
import { getPrimaryNotification } from "@aca/desktop/domains/group/group";
import { NotificationOrGroup } from "@aca/desktop/domains/group/groupNotifications";
import { createNotificationsListModel } from "@aca/desktop/domains/list/model";
import { desktopRouter } from "@aca/desktop/routes";
import { observableGrowingArray } from "@aca/shared/mobx/utils";

interface CreateFocusSessionInput {
  notificationsGetter: () => NotificationEntity[];
  activeNotification: NotificationOrGroup;
  listId: string;
}

const getIsActioned = cachedComputed(function getIsActioned(item: NotificationOrGroup) {
  if (item.kind === "group") {
    return item.notifications.every((n) => n.isResolved || n.isSaved || n.hasReminder);
  }

  return item.isResolved || item.isSaved || item.hasReminder;
});

function createFocusSession({ notificationsGetter, activeNotification, listId }: CreateFocusSessionInput) {
  const growingList = observableGrowingArray(notificationsGetter, (n) => n.id);

  const listModel = createNotificationsListModel(() => {
    return growingList.get();
  });

  const session = makeAutoObservable(
    {
      get listId() {
        return listId;
      },
      get groups() {
        if (!getNullableDb()) return [];

        return listModel.getGroups();
      },
      get next(): NotificationOrGroup | null {
        return listModel.getNextNotification(getPrimaryNotification(session.activeNotification));
      },
      get prev(): NotificationOrGroup | null {
        return listModel.getPreviousNotification(getPrimaryNotification(session.activeNotification));
      },
      get notificationsToPreload(): NotificationEntity[] {
        const { activeNotification, groups } = session;

        const indexOfActive = groups.indexOf(activeNotification);

        if (indexOfActive === -1 || indexOfActive === 0) {
          console.warn("incorrect index");

          return groups.slice(0, 3).map(getPrimaryNotification);
        }

        return groups.slice(indexOfActive - 1, indexOfActive + 2).map(getPrimaryNotification);
      },
      get isDone(): boolean {
        return session.groups.every(getIsActioned);
      },
      goToNext() {
        if (!session.next) return;

        animationStore.upcomingEmbedAnimation = "swipe-up";

        session.activeNotification = session.next;

        return () => {
          session.goToPrev();
        };
      },
      goToPrev() {
        if (!session.prev) return;

        animationStore.upcomingEmbedAnimation = "swipe-down";

        session.activeNotification = session.prev;

        return () => {
          session.goToNext();
        };
      },
      activeNotification,
    },
    { activeNotification: observable.ref }
  );

  return session;
}

export type FocusSession = ReturnType<typeof createFocusSession>;

export const focusSessionStore = makeObservable(
  {
    session: null as null | FocusSession,
  },
  { session: observable.ref }
);

const getShouldUseFocusBar = cachedComputed(() => {
  return applicationWideSettingsBridge.get().useFocusBar === true;
});

export function startFocusSession(input: CreateFocusSessionInput) {
  const newSession = createFocusSession(input);

  runInAction(() => {
    focusSessionStore.session = newSession;
  });

  if (!getShouldUseFocusBar()) {
    desktopRouter.navigate("focus");
  }
}

export function stopFocusSession() {
  const { session } = focusSessionStore;

  if (!session) return;

  runInAction(() => {
    focusSessionStore.session = null;
    desktopRouter.navigate("list", { listId: session.listId });
  });
}
