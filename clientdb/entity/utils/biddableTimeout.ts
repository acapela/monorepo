export function createBiddableTimeout(time: number, endCallback: () => void) {
  let currentBidTimeout: ReturnType<typeof setTimeout>;
  function bid() {
    if (currentBidTimeout) {
      clearTimeout(currentBidTimeout);
    }

    currentBidTimeout = setTimeout(endCallback, time);
  }

  return bid;
}
