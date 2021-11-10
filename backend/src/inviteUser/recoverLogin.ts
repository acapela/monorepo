import { Request, Response, Router } from "express";

import { db } from "~db";
import { DEFAULT_NOTIFICATION_EMAIL, sendEmail } from "~shared/email";

import { getInviteURL } from "./utils";

export const router = Router();

router.post("/v1/login/recover", async (req: Request, res: Response) => {
  const email = (req.body.email as string).toLowerCase();
  const user = await db.user.findFirst({ where: { email, account: { none: {} } } });
  if (user) {
    await sendEmail({
      from: DEFAULT_NOTIFICATION_EMAIL,
      subject: "Your Acapela Invitation",
      to: user.email,
      html: `Follow <a href="${getInviteURL(user.id)}">this link</a> to sign up and join the discussion.`,
    });
  }
  res.sendStatus(200);
});
