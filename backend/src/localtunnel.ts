import os from "os";
import localtunnel, { Tunnel } from "localtunnel";

const hostname = os.hostname().toLocaleLowerCase().replace(/\./g, "-");

let tunnel: Tunnel | null = null;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const backendPort = process.env.BACKEND_PORT!;
/**
 * localtunnel creates a tunnel from localhost to a publicly available URL
 * This way it's possible to receive webhooks to the dev environment
 */
export async function getTunnelPublicUrl(): Promise<string> {
  if (!tunnel) {
    tunnel = await localtunnel({
      subdomain: `acapela-dev-${hostname}`,
      port: parseInt(backendPort, 10),
      allow_invalid_cert: true,
    });

    tunnel.on("close", () => {
      tunnel = null;
    });
  }

  return tunnel.url;
}
