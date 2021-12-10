import { db } from "~db";

/**
 * We hardcode bot user id. This is to avoid having to perform lookups to ensure bot is created in database already or not.
 *
 * Also it makes nested transaction easier as we know this id in advance.
 *
 * Might also be quite future proof if we have more than one bot.
 */
export const BOT_USER_ID = "690f446b-716a-42da-a27c-70a95be7df39";

const BOT_NAME = "Einstein the Alpaca";

const BOT_AVATAR_URL = `${process.env.FRONTEND_URL}/bot/avatar.png`;

export async function ensureBotUserExists() {
  const botUser = await db.user.upsert({
    create: {
      id: BOT_USER_ID,
      name: BOT_NAME,
      avatar_url: BOT_AVATAR_URL,
      email: "team@acape.la",
      is_bot: true,
    },
    update: {},
    where: {
      id: BOT_USER_ID,
    },
  });

  return botUser;
}
