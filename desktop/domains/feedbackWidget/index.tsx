import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { USERSNAP_GLOBAL_API_KEY } from "@aca/desktop/lib/env";
import { authStore } from "@aca/desktop/store/auth";
import { autorunEffect } from "@aca/shared/mobx/utils";

interface UsersnapInitParams {
  user: { userId: string; email: string };
}

const log = makeLogger("Feedback");

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
let currentApi: any = null;

autorunEffect(() => {
  const user = authStore.userTokenData;

  if (!USERSNAP_GLOBAL_API_KEY || !user) return;

  window.onUsersnapCXLoad = function (api) {
    const initParams: UsersnapInitParams = { user: { userId: user.id, email: user.email } };
    api.init(initParams);
    currentApi = api;
    log("feedback widget ready");
  };
  const script = document.createElement("script");
  script.defer = true;
  script.src = `https://widget.usersnap.com/global/load/${USERSNAP_GLOBAL_API_KEY}?onload=onUsersnapCXLoad`;
  document.head.appendChild(script);

  return () => {
    if (currentApi) {
      currentApi.destroy();
      currentApi = null;
      log("feedback widget removed");
    }
    script.remove();
  };
});

export function openFeedbackWidget() {
  if (!currentApi) {
    log.error("feedback widget used without user or api key");
    throw new Error("Cannot share feedback without user");
  }

  currentApi.logEvent("feedback_button_clicked");
}
