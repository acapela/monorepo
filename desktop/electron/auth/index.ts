import { initializeLoginHandler } from "./acapela";
import { initializeFigmaAuthHandler } from "./figma";
import { initializeGoogleAuthHandler } from "./google";
import { initializeLinearAuthHandler } from "./linear";
import { initializeNotionAuthHandler } from "./notion";
import { initializeSlackAuthHandler } from "./slack";

export function initializeAuthHandlers() {
  initializeLoginHandler();
  initializeNotionAuthHandler();
  initializeGoogleAuthHandler();
  initializeSlackAuthHandler();
  initializeFigmaAuthHandler();
  initializeLinearAuthHandler();
}
