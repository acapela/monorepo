import { NotificationServiceName } from "../electron/apps";
import { createInvokeBridge } from "./base/channels";

export const loginToService = createInvokeBridge<Boolean, NotificationServiceName>("login-to-service");
