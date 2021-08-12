import os from "os";
import localtunnel from "localtunnel";
import { assertDefined } from "~shared/assert";
import { isDev } from "~shared/dev";

const backendPort = assertDefined(process.env.BACKEND_PORT, "BACKEND_PORT env variable is required");

const hostname = os.hostname().toLocaleLowerCase().replace(/\./g, "-");

/**
 * localtunnel creates a tunnel from localhost to a publicly available URL
 * This way it's possible to receive webhooks to the dev environment
 */

export const getDevPublicTunnel = createSelfCleaningCache(async (reset) => {
  if (!isDev()) {
    throw new Error(`Public tunnel is only allowed to be used in dev mode.`);
  }

  const tunnel = await localtunnel({
    subdomain: `acapela-dev-${hostname}`,
    port: parseInt(backendPort, 10),
    allow_invalid_cert: true,
  });

  tunnel.once("close", () => {
    reset();
  });

  return tunnel;
});

export async function getDevPublicTunnelUrl(): Promise<string> {
  const tunnel = await getDevPublicTunnel();

  return tunnel.url;
}

function createSelfCleaningCache<T>(getter: (reset: () => void) => T): () => T {
  let cachedValue: T | null;

  function reset() {
    cachedValue = null;
  }

  function get(): T {
    if (cachedValue) return cachedValue;

    const newValue = getter(reset);

    cachedValue = newValue;

    return newValue;
  }

  return get;
}
