export function isDev() {
  return !["staging", "production"].includes(process.env.STAGE);
}

export function measureTime(name: string) {
  const time = Date.now();
  const fullLabel = `${name}-${time}`;

  // eslint-disable-next-line no-console
  console.time(fullLabel);
  return function end() {
    // eslint-disable-next-line no-console
    console.timeEnd(fullLabel);
  };
}
