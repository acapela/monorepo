export function isMac() {
  // Server side let's guess
  if (typeof navigator === "undefined") return true;

  return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
}
