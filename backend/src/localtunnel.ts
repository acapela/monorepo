import os from "os";

import { assertDefined } from "~shared/assert";
import { IS_DEV } from "~shared/dev";

const backendPort = assertDefined(process.env.BACKEND_PORT, "BACKEND_PORT env variable is required");

const hostname = os.hostname().toLocaleLowerCase().replace(/\./g, "-");

/**
 * localtunnel creates a tunnel from localhost to a publicly available URL
 * This way it's possible to receive webhooks to the dev environment
 */

export const getDevPublicTunnelURL = createSelfCleaningCache(
  async (reset, port: number = parseInt(backendPort, 10)) => {
    if (!IS_DEV) {
      throw new Error(`Public tunnel is only allowed to be used in dev mode.`);
    }

    if (process.env.NGROK_AUTH_TOKEN) {
      const { default: ngrok } = await import("ngrok");
      return await ngrok.connect({
        authtoken: process.env.NGROK_AUTH_TOKEN,
        addr: port,
        onTerminated: reset,
        subdomain: process.env.NGROK_SUBDOMAIN,
      });
    }

    const { default: localtunnel } = await import("localtunnel");
    const tunnel = await localtunnel({
      subdomain: `acapela-dev-${hostname}-${port}`,
      port,
      allow_invalid_cert: true,
    });

    tunnel.once("close", () => {
      reset();
    });

    return tunnel.url;
  }
);

// Allows sharing instances between invocations with the same arguments.
// The given function also receives a reset function as the first parameter
// which it can use to nuke the cache, thus being called anew in the next
// invocation.
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
