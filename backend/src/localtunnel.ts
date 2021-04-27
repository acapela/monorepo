import os from "os";
import localtunnel, { Tunnel } from "localtunnel";

const hostname = os.hostname().toLocaleLowerCase().replace(/\./g, "-");

let tunnel: Tunnel | null = null;

export async function getTunnelPublicUrl() {
  if (!tunnel) {
    tunnel = await localtunnel({
      subdomain: `acapela-dev-${hostname}`,
      port: process.env.BACKEND_PORT,
      allow_invalid_cert: true,
    });

    tunnel.on("close", () => {
      tunnel = null;
    });
  }

  return tunnel.url;
}
