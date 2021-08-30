export function wait(time: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, time);
  });
}

export function createTimeout(callback: () => void, time: number) {
  const timeoutNumber = setTimeout(callback, time);

  return function clear() {
    clearTimeout(timeoutNumber);
  };
}

export function formatMsTimeToPlaybackTime(time: number) {
  if (!Number.isFinite(time)) {
    return "--:--";
  }
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  const paddedSeconds = `${seconds}`.padStart(2, "0");

  return `${minutes}:${paddedSeconds}`;
}
