import { getNumbersAverage } from "@aca/shared/numbers";
import { startRequestAnimationFrameLoop } from "@aca/shared/raf";

function getNow() {
  if (typeof performance === undefined) {
    return Date.now();
  }
  // Performance 'now' is float precision time.
  return performance.now();
}

export type EndFpsMeasurement = () => number;

export function startMeasuringFps(): EndFpsMeasurement {
  const frameTimes: number[] = [];

  let previousFrameTime = getNow();

  const stopLoop = startRequestAnimationFrameLoop(() => {
    const now = getNow();
    const frameTime = getNow() - previousFrameTime;

    previousFrameTime = now;

    frameTimes.push(frameTime);
  });

  return function finish() {
    stopLoop();
    const fps = convertFrameTimesToFps(frameTimes);

    return fps;
  };
}

function convertFrameTimesToFps(frameTimes: number[]) {
  const averageFrameTime = getNumbersAverage(frameTimes);

  const fps = 1000 / averageFrameTime;

  return fps;
}
