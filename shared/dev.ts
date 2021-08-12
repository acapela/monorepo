export function isDev() {
  return !["staging", "production"].includes(process.env.STAGE);
}
