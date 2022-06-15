import { createActionView } from "@aca/desktop/actions/action/view";
import { getPrimaryNotification } from "@aca/desktop/domains/group/group";
import { desktopRouter } from "@aca/desktop/routes";
import { focusSessionStore, stopFocusSession } from "@aca/desktop/store/focus";
import { uiStore } from "@aca/desktop/store/ui";

export const focusPageView = createActionView(() => {
  const { session } = focusSessionStore;
  //
  if (!session) return null;

  const view = {
    session,
    get notification() {
      return getPrimaryNotification(session.activeNotification);
    },
    get nextNotification() {
      return session.next;
    },
    get prevNotification() {
      return session.prev;
    },
    focusNextItemIfAvailable() {
      return session.goToNext();
    },
    focusPrevItemIfAvailable() {
      return session.goToPrev();
    },
    displayZenModeIfFinished() {
      if (!session.isDone) {
        return;
      }
      uiStore.isDisplayingZenImage = true;
      desktopRouter.navigate("list", { listId: session.listId });
      stopFocusSession();
    },
    goToPreviousNotification() {
      return session.goToPrev();
    },
    goToNextNotification() {
      return session.goToNext();
    },
  };

  return view;
});
