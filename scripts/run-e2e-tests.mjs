/* global $, fetch */

// start backend and desktop build in background
$`yarn backend:dev`.catch(console.error);
$`yarn desktop dev no-electron`.catch(console.error);

// build frontend
await $`yarn frontend build`;

async function checkUp() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 200);
  try {
    const resp = await fetch("http://localhost:3000/api/backend/healthz", { signal: controller.signal });
    const healthz = await resp.json();
    clearTimeout(timeout);
    return healthz.status === "ok";
  } catch (e) {
    console.error(e);
  }
  clearTimeout(timeout);
  return false;
}

for (let i = 0; i < 100; i++) {
  if (await checkUp()) break;
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

// start e2e tests
$`yarn e2e test electron`;
