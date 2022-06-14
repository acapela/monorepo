import { makeAutoObservable, makeObservable, observable, runInAction } from "mobx";

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

export const NEW_FOCUS = !true;

export function startFocusSession(input: CreateFocusSessionInput) {
  if (NEW_FOCUS) {
    const session = createFocusSession(input);

    runInAction(() => {
      focusSessionStore.session = session;
    });
  } else {
    desktopRouter.navigate("focus", { listId: input.list.id, notificationId: input.activeNotification.id });
  }
}

export function stopFocusSession() {
  if (NEW_FOCUS) {
    runInAction(() => {
      focusSessionStore.session = null;
    });
  } else {
    const { listId } = desktopRouter.assertGetActiveRouteParams("focus");
    desktopRouter.navigate("list", { listId });
  }
}
