if (process.env.ELECTRON_CONTEXT !== "client") {
  process.env = {
    ...process.env,
    ...require("./generated"),
  };
}

export const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:3000";
export const USERSNAP_GLOBAL_API_KEY = process.env.USERSNAP_GLOBAL_API_KEY; // only defined in prod
export const SEGMENT_API_KEY = process.env.SEGMENT_API_KEY; // defined in prod, staging and dev
const urlObject = new URL(FRONTEND_URL);
export const WEBSOCKET_URL = `${urlObject.protocol === "https:" ? "wss" : "ws"}://${urlObject.host}`;
