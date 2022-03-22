import { Webhooks, createNodeMiddleware } from "@octokit/webhooks";
import { Router } from "express";

export const router = Router();

const webhooks = new Webhooks({
  secret: "todo",
});

webhooks.onAny((event) => console.info(event));

router.post("/v1/github/webhook", createNodeMiddleware(webhooks, { path: "/v1/github/webhook" }));
