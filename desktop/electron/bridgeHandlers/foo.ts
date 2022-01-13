import { getFoo, pingPongChannel } from "@aca/desktop/bridge/foo";

export function initializeFooBridge() {
  getFoo.handle(async (input) => {
    return `super ${input}`;
  });

  pingPongChannel.subscribe((message, event) => {
    console.info("got message", message);
    event.reply(`pong (${message})`);
  });
}
