if (process.env.ELECTRON_CONTEXT !== "client") {
  process.env = {
    ...process.env,
    ...require("./generated"),
  };
}

export const FRONTEND_URL = process.env.FRONTEND_URL ?? "https://app-staging.acape.la";
const urlObject = new URL(FRONTEND_URL);
export const WEBSOCKET_URL = `${urlObject.protocol === "https:" ? "wss" : "ws"}://${urlObject.host}`;
