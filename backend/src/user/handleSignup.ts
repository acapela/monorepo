import { HasuraEvent } from "@aca/backend/src/hasura";
import { User, db } from "@aca/db";

export async function handleSignup(event: HasuraEvent<User>) {
  const usedReferralCode = event.item.used_referral_code;
  if (!usedReferralCode) return;

  // this ensures the computed field `count_referrals` is updated
  await db.user.update({
    where: { referral_code: usedReferralCode },
    data: { updated_at: null },
  });
}
