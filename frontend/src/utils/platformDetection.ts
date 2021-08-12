export function isMac() {
  // All of apple computers use "Mac".
  // https://stackoverflow.com/a/11752084
  const platform = global.window && window.navigator.platform;
  return platform && platform.toLowerCase().includes("mac");
}
