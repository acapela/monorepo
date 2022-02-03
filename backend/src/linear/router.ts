import { createHmac } from "crypto";

import { LinearClient } from "@linear/sdk";
import axios from "axios";
import { addSeconds } from "date-fns";
import { Request, Response, Router } from "express";
import { get, map } from "lodash";
import qs from "qs";

import { CommentWebhook, IssueWebhook, Webhook } from "@aca/backend/src/linear/types";
import { getUserIdFromRequest } from "@aca/backend/src/utils";
import { LinearOauthToken, db } from "@aca/db";
import { logger } from "@aca/shared/logger";

import { BadRequestError } from "../errors/errorTypes";
import { HttpStatus } from "../http";

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
  const [user, org] = await Promise.all([linearClient.viewer, linearClient.organization]);
  await db.linear_oauth_token.upsert({
    where: {
      user_id_linear_user_id_linear_organization_id: {
        user_id: userId,
        linear_user_id: user.id,
        linear_organization_id: org.id,
      },
    },
    update: {
      access_token: oauthToken,
      expires_at: expires,
    },
    create: {
      user_id: userId,
      linear_user_id: user.id,
      linear_organization_id: org.id,
      access_token: oauthToken,
      expires_at: expires,
    },
  });
  res.status(HttpStatus.OK).end();
});

async function saveIssue(usersForOrg: LinearOauthToken[], payload: IssueWebhook) {
  const notificationPromises = usersForOrg
    .filter((u) => payload.data.subscriberIds.includes(u.linear_user_id || ""))
    .map((u) =>
      db.notification_linear.create({
        data: {
          notification: {
            create: {
              user_id: u.user_id,
              url: payload.url,
              from: "Linear",
            },
          },
          type: payload.type,
          issue_id: payload.data.id,
          issue_title: payload.data.title,
        },
      })
    );
  return Promise.all(notificationPromises);
}

async function saveComment(usersForOrg: LinearOauthToken[], payload: CommentWebhook) {
  // pick a random token to access linear api
  const randomUserToken = usersForOrg[Math.floor(usersForOrg.length * Math.random())].access_token;
  const linearClient = new LinearClient({
    accessToken: randomUserToken,
  });
  const subscribersRes = await linearClient.client.rawRequest(
    `
  query Issue($id: String!) {
    issue(id: $id) {
      subscribers {
        nodes {
          id
        }
      }
    }
  }
  `,
    { id: payload.data.issue.id }
  );
  if (subscribersRes.status != 200) {
    throw new Error(`linear api request error: ${subscribersRes.status}`);
  }
  const subscribers = map(get(subscribersRes.data, "issue.subscribers.nodes", []), "id");
  const notificationPromises = usersForOrg
    .filter((u) => subscribers.includes(u.linear_user_id || ""))
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
          type: payload.type,
          issue_id: payload.data.issue.id,
          issue_title: payload.data.issue.title,
        },
      })
    );
  return Promise.all(notificationPromises);
}

router.post("/v1/linear/webhook", async (req: Request, res: Response) => {
  // accept webhook
  res.status(HttpStatus.NO_CONTENT).end();

  const payload = req.body as Webhook;
  // ignore updated and removed actions for now
  if (payload.action != "create") return;

  console.info(payload);

  // fetch all users for notified org
  const usersForOrg = await db.linear_oauth_token.findMany({
    where: {
      linear_organization_id: payload.organizationId,
    },
  });

  if (payload.type === "Issue") await saveIssue(usersForOrg, payload);
  if (payload.type === "Comment") await saveComment(usersForOrg, payload);
});
