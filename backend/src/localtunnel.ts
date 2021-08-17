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

export const getDevPublicTunnel = createSelfCleaningCache(async (reset, port: number = parseInt(backendPort, 10)) => {
  if (!isDev()) {
    throw new Error(`Public tunnel is only allowed to be used in dev mode.`);
  }

  const tunnel = await localtunnel({
    subdomain: `acapela-dev-${hostname}-${port}`,
    port,
    allow_invalid_cert: true,
  });

  tunnel.once("close", () => {
    reset();
  });

  return tunnel;
});

function createSelfCleaningCache<Args extends unknown[], R>(
  getter: (reset: () => void, ...args: Args) => R
): (...p: Args) => R {
  const cache = new Map<string, R>();

  function reset() {
    cache.clear();
  }

  return function get(...p) {
    const key = JSON.stringify(p);

    const value = cache.get(key);
    if (value) {
      return value;
    }

    const newValue = getter(reset, ...p);

    cache.set(key, newValue);

    return newValue;
  };
}
