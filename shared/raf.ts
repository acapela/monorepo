export function startRequestAnimationFrameLoop(loop: () => void) {
  let stopCurrent: () => void;

  function next() {
    stopCurrent = createRequestAnimationFrame(() => {
      loop();
      next();
    });
  }

  next();

  return function stop() {
    if (stopCurrent) {
      stopCurrent();
    }
  };
}

export function createRequestAnimationFrame(callback: () => void) {
  const requestId = requestAnimationFrame(callback);

  return function cancel() {
    cancelAnimationFrame(requestId);
  };
}
