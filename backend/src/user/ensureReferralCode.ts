import { db } from "@aca/db";

import { createNewReferralCode } from "../utils";

// once all users have a referral code, we can delete this helper
export async function ensureReferralCode() {
  const users = await db.user.findMany({ where: { referral_code: null } });
  for (const user of users) {
    await db.user.update({ where: { id: user.id }, data: { referral_code: createNewReferralCode() } });
  }
}
