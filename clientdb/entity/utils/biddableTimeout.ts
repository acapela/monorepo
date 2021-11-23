export function createBiddableTimeout(time: number, endCallback: () => void) {
  let currentBidTimeout: ReturnType<typeof setTimeout>;

  function stopCurrentBid() {
    if (currentBidTimeout) {
      clearTimeout(currentBidTimeout);
    }
  }

  function bid() {
    stopCurrentBid();
    currentBidTimeout = setTimeout(endCallback, time);
  }

  return [bid, stopCurrentBid] as const;
}
