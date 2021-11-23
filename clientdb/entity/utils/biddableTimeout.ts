export function createBiddableTimeout(time: number, endCallback: () => void) {
  let currentBidTimeout: ReturnType<typeof setTimeout>;

  function stopBid() {
    if (currentBidTimeout) {
      clearTimeout(currentBidTimeout);
    }
  }

  function bid() {
    stopBid();
    currentBidTimeout = setTimeout(endCallback, time);
  }

  return [bid, stopBid];
}
