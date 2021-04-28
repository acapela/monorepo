import localtunnel, { Tunnel } from "localtunnel";

let tunnel: Tunnel | null = null;

/**
 * localtunnel creates a tunnel from localhost to a publicly available URL
 * This way it's possible to receive webhooks to the dev environment
 */
export async function getTunnelPublicUrl(): Promise<string> {
  if (!tunnel) {
    tunnel = await localtunnel({ subdomain: "acapela-dev", port: process.env.BACKEND_PORT, allow_invalid_cert: true });

    tunnel.on("close", () => {
      tunnel = null;
    });
  }

  return tunnel.url;
}
