import { createTimeout } from "~shared/time";

export function createBiddableTimeout(time: number, endCallback: () => void) {
  let currentBidTimeout: () => void;
  function bid() {
    if (currentBidTimeout) {
      currentBidTimeout();
    }

    currentBidTimeout = createTimeout(endCallback, time);
  }

  return bid;
}
