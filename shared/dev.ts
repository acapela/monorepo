export function isDev() {
  return !["staging", "production"].includes(process.env.STAGE);
}

export function measureTime(name: string) {
  const time = Date.now();
  const fullLabel = `${name}-${time}`;

  console.time(fullLabel);
  return function end() {
    console.timeEnd(fullLabel);
  };
}
