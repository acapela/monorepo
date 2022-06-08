import { subSeconds } from "date-fns";

import { HasuraEvent } from "@aca/backend/src/hasura";
import { User, db } from "@aca/db";

const OnboardingNotifications = [
  {
    title: "🚀 0. Welcome! Start Here",
    url: "https://acapela.notion.site/0-Start-Here-a6ecfbc7926a423bbb3036fed7fea09a",
  },
  {
    title: "🔕 1. Less distractions = Better deep work",
    url: "https://acapela.notion.site/1-Less-distractions-Better-deep-work-7526173e5d4443b3864039c5809cc1a8",
  },
  {
    title: "🌟 2. No more “Mark as unread”",
    url: "https://acapela.notion.site/2-No-more-Mark-as-unread-f06fa083fed5404d8478e51694de860f",
  },
  {
    title: "🛰️ 3. From Zero to Power User",
    url: "https://acapela.notion.site/3-From-Zero-to-Power-User-b4241f914b4b44e5a2eeead9c3605e06",
  },
];

export async function handleSignup(event: HasuraEvent<User>) {
  const usedReferralCode = event.item.used_referral_code;
  if (usedReferralCode) {
    // this ensures the computed field `count_referrals` is updated at the client
    await db.user.update({
      where: { referral_code: usedReferralCode },
      data: { updated_at: null },
    });
  }

  const baseCreatedAt = new Date();

  for (let i = 0; i < OnboardingNotifications.length; i++) {
    // We want the first notification to be first in the list
    const created_at = subSeconds(baseCreatedAt, i);

    const { url, title } = OnboardingNotifications[i];

    await db.notification.create({
      data: {
        url,
        from: "Acapela",
        user_id: event.item.id,
        created_at,
        updated_at: created_at,
        notification_acapela: {
          create: {
            title,
            created_at,
            updated_at: created_at,
          },
        },
      },
    });
  }
}
