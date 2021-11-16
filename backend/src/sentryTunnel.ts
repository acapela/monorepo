import { captureException } from "@sentry/node";
import axios from "axios";
import { Request, Response, Router } from "express";

const sentryProjectId = process.env.SENTRY_DSN ? process.env.SENTRY_DSN.split("/").pop() : "";
const sentryAPIEndpoint = `https://sentry.io/api/${sentryProjectId}/envelope/`;

export const router = Router();

router.post("/sentry-tunnel", async (req: Request, res: Response) => {
  try {
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const envelope = Buffer.concat(buffers);
    const header = JSON.parse(envelope.toString().split("\n")[0]);

    // check if dsn is matching
    if (header.dsn !== process.env.SENTRY_DSN) {
      res.status(400).send({ error: "invalid dsn" });
      return;
    }

    // proxy envelope to sentry
    const response = await axios.post(sentryAPIEndpoint, envelope);
    res.status(response.status).send(await response.data);
  } catch (e) {
    captureException(e);
    res.status(400).send({ error: "invalid request" });
  }
});
