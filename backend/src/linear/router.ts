import { createHmac } from "crypto";

import { LinearClient } from "@linear/sdk";
import { Prisma } from "@prisma/client";
import axios from "axios";
import { addSeconds } from "date-fns";
import { Request, Response, Router } from "express";
import { keyBy, map } from "lodash";
import qs from "qs";

import { CommentWebhook, IssueWebhook, Webhook } from "@aca/backend/src/linear/types";
import { getUserIdFromRequest } from "@aca/backend/src/utils";
import { db } from "@aca/db";
import { logger } from "@aca/shared/logger";

import { BadRequestError } from "../errors/errorTypes";
import { HttpStatus } from "../http";
import { fetchSubscribers, fetchViewer, getRandomLinearClient, getUsersForOrganizationId } from "./utils";

export const router = Router();

const redirect_uri = `${process.env.FRONTEND_URL}/api/backend/v1/linear/callback`;
const client_id = process.env.LINEAR_CLIENT_ID;
const client_secret = process.env.LINEAR_CLIENT_SECRET;
const oauthStateSecret = process.env.LINEAR_OAUTH_SECRET;

function getSignedState(uid: string): string {
  const hmac = createHmac("sha256", oauthStateSecret);
  hmac.update(uid);
  return `${uid}:${hmac.digest("hex")}`;
}

router.get("/v1/linear/auth", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const queryString = qs.stringify({
    response_type: "code",
    client_id,
    redirect_uri,
    state: getSignedState(userId),
    scope: "read",
  });
  res.redirect(`https://linear.app/oauth/authorize?${queryString}`);
});

router.get("/v1/linear/callback", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const { code, state } = req.query;
  if (!code) throw new BadRequestError("code is missing");
  if (!state) throw new BadRequestError("state is missing");
  const validState = getSignedState(userId);
  if (validState !== state) throw new BadRequestError("invalid state");

  const params = qs.stringify({
    code,
    redirect_uri,
    client_id,
    client_secret,
    grant_type: "authorization_code",
  });

  let oauthRes;
  try {
    oauthRes = await axios.post("https://api.linear.app/oauth/token", params, {
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
  } catch (e) {
    logger.error("oauth error: " + e);
    throw new BadRequestError("oauth error");
  }
  if (oauthRes.status !== 200) {
    logger.error(`oauth response error (${oauthRes.status}): ` + oauthRes.data);
    throw new BadRequestError("oauth error");
  }
  const oauthToken = oauthRes.data.access_token;
  const expires = addSeconds(new Date(), oauthRes.data.expires_in);

  const linearClient = new LinearClient({
    accessToken: oauthToken,
  });
  const viewer = await fetchViewer(linearClient);

  const pk = {
    user_id: userId,
    linear_user_id: viewer.id,
    linear_organization_id: viewer.organizationId,
  };
  const update = {
    access_token: oauthToken,
    expires_at: expires,
  };
  await db.linear_oauth_token.upsert({
    where: {
      user_id_linear_user_id_linear_organization_id: pk,
    },
    update,
    create: {
      ...pk,
      ...update,
    },
  });
  res.status(HttpStatus.OK).end();
});

async function saveComment(payload: CommentWebhook) {
  const usersForOrg = await getUsersForOrganizationId(payload.organizationId);
  if (!usersForOrg.length) return;
  const linearClient = getRandomLinearClient(usersForOrg);
  const subscribers = await fetchSubscribers(linearClient, payload.data.issue.id);
  const subscriberIds = map(subscribers, "id");
  const subscriberByName = keyBy(subscribers, "displayName");
  const mentionIds = [...payload.data.body.matchAll(/@([^\s]+)/gm)]
    .map((m) => subscriberByName[m[1]])
    .filter(Boolean)
    .map((u) => u.id);
  const notificationPromises = usersForOrg
    .filter((u) => u.linear_user_id !== payload.data.userId && subscriberIds.includes(u.linear_user_id || ""))
    .map((u) =>
      db.notification_linear.create({
        data: {
          notification: {
            create: {
              user_id: u.user_id,
              url: payload.url,
              from: payload.data.user.name,
            },
          },
          type: "Comment",
          issue_id: payload.data.issueId,
          issue_title: payload.data.issue.title,
          creator_id: payload.data.userId,
          origin: mentionIds.includes(u.linear_user_id) ? "mention" : "comment",
        },
      })
    );
  return Promise.all(notificationPromises);
}

async function addIssueToDatabase(payload: IssueWebhook) {
  const issueData = {
    organization_id: payload.organizationId,
    title: payload.data.title,
    url: payload.url,
    data: payload.data as unknown as Prisma.JsonObject,
    last_webhook_action: payload.action,
  };
  return db.linear_issue.upsert({
    where: {
      id: payload.data.id,
    },
    create: {
      id: payload.data.id,
      ...issueData,
    },
    update: {
      ...issueData,
    },
  });
}

router.post("/v1/linear/webhook", async (req: Request, res: Response) => {
  // accept webhook
  res.status(HttpStatus.NO_CONTENT).end();

  const payload = req.body as Webhook;

  if (payload.type === "Issue") await addIssueToDatabase(payload);

  // comment updates are not handled
  if (payload.action === "create" && payload.type === "Comment") await saveComment(payload);
});
