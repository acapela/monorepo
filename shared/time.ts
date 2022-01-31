/**
 * Indicates at what time app started. It can be used in various scenarios:
 * - measuring how long did it take to load the app
 * - detecting 'new' topics (we compare last activity date with app startup time.)
 *
 * This date is const for entire lifecycle of the app until browser window is refreshed
 */
export const appStartTime = new Date();

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
export function createInterval(callback: () => void, time: number) {
  const intervalNumber = setInterval(callback, time);

  return function clear() {
    clearInterval(intervalNumber);
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

export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const QUATER = MINUTE * 15;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;

export const timeDuration = {
  second: SECOND,
  minute: MINUTE,
  quater: QUATER,
  hour: HOUR,
  day: DAY,
};
