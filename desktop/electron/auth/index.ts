import { initializeLoginHandler } from "./acapela";
import { initializeNotionAuthHandler } from "./notion";

export function initializeAuthHandlers() {
  initializeLoginHandler();
  initializeNotionAuthHandler();
}
