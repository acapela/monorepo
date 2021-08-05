import os from "os";
import localtunnel, { Tunnel } from "localtunnel";
import { assertDefined } from "~shared/assert";
import { isDev } from "~shared/dev";

const backendPort = assertDefined(process.env.BACKEND_PORT, "BACKEND_PORT env variable is required");

const hostname = os.hostname().toLocaleLowerCase().replace(/\./g, "-");

let tunnelPromise: Promise<Tunnel> | null;
let tunnel: Tunnel | null = null;
/**
 * localtunnel creates a tunnel from localhost to a publicly available URL
 * This way it's possible to receive webhooks to the dev environment
 */

export async function getDevPublicTunnel(): Promise<Tunnel> {
  if (!isDev()) {
    throw new Error(`Public tunnel is only allowed to be used in dev mode.`);
  }

  if (tunnel) {
    return tunnel;
  }

  if (tunnelPromise) {
    return tunnelPromise;
  }

  tunnelPromise = localtunnel({
    subdomain: `acapela-dev-${hostname}`,
    port: parseInt(backendPort, 10),
    allow_invalid_cert: true,
  });

  tunnel = await tunnelPromise;
  tunnelPromise = null;

  tunnel.once("close", () => {
    tunnel = null;
  });

  return tunnel;
}

export async function getDevPublicTunnelUrl(): Promise<string> {
  const tunnel = await getDevPublicTunnel();

  return tunnel.url;
}
