import { makeAutoObservable, makeObservable, observable, runInAction } from "mobx";

import { cachedComputed } from "@aca/clientdb";
import { applicationWideSettingsBridge } from "@aca/desktop/bridge/system";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { desktopRouter } from "@aca/desktop/routes";

interface CreateFocusSessionInput {
  list: NotificationsList;
  activeNotification: NotificationEntity;
}

function createFocusSession({ list, activeNotification }: CreateFocusSessionInput) {
  return makeAutoObservable({ list, activeNotification }, { list: observable.ref, activeNotification: observable.ref });
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
  if (getShouldUseFocusBar()) {
    const newSession = createFocusSession(input);

    runInAction(() => {
      focusSessionStore.session = newSession;
    });
  } else {
    desktopRouter.navigate("focus", { listId: input.list.id, notificationId: input.activeNotification.id });
  }
}

export function stopFocusSession() {
  if (getShouldUseFocusBar()) {
    runInAction(() => {
      focusSessionStore.session = null;
    });
  } else {
    const { listId } = desktopRouter.assertGetActiveRouteParams("focus");
    desktopRouter.navigate("list", { listId });
  }
}
