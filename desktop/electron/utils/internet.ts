import http2 from "http2";

/**
 * https://stackoverflow.com/a/60902742
 */
export async function checkAccessToInternet(host = "https://www.google.com") {
  return new Promise((resolve) => {
    const client = http2.connect(host);
    client.on("connect", () => {
      resolve(true);
      client.destroy();
    });
    client.on("error", () => {
      resolve(false);
      client.destroy();
    });
  });
}
