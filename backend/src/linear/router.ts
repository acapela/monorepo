import axios from "axios";
import { Request, Response, Router } from "express";
import qs from "qs";

import { logger } from "@aca/shared/logger";

import { BadRequestError } from "../errors/errorTypes";
import { HttpStatus } from "../http";

export const router = Router();

const redirect_uri = `${process.env.FRONTEND_URL}/api/backend/v1/linear/callback`;
const client_id = process.env.LINEAR_CLIENT_ID;
const client_secret = process.env.LINEAR_CLIENT_SECRET;

router.get("/v1/linear/auth", async (req: Request, res: Response) => {
  const queryString = qs.stringify({
    response_type: "code",
    client_id,
    redirect_uri,
    state: "supersecure",
    scope: "read",
  });
  res.redirect(`https://linear.app/oauth/authorize?${queryString}`);
});

router.get("/v1/linear/callback", async (req: Request, res: Response) => {
  const { code } = req.query;
  if (!code) throw new BadRequestError("code is missing");
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
  if (oauthRes.status !== 200) throw new BadRequestError("oauth error");
  console.info(oauthRes.data.access_token);
  //TODO save in db
  res.status(HttpStatus.OK).end();
});

router.post("/v1/linear/webhook", async (req: Request, res: Response) => {
  console.info(req.body);
  res.status(HttpStatus.OK).end();
});
