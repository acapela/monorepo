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
