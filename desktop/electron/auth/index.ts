import { initializeLoginHandler } from "./acapela";
import { initializeGoogleAuthHandler } from "./google";
import { initializeNotionAuthHandler } from "./notion";
import { initializeSlackAuthHandler } from "./slack";

export function initializeAuthHandlers() {
  initializeLoginHandler();
  initializeNotionAuthHandler();
  initializeGoogleAuthHandler();
  initializeSlackAuthHandler();
}
