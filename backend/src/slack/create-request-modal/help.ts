import { Context, Image, Md, Message, Section } from "slack-block-builder";

import { getDevPublicTunnelURL } from "~backend/src/localtunnel";
import { IS_DEV } from "~shared/dev";

function sentences(...list: string[]) {
  return list.join(" ");
}

async function getMessageActionsImageUrl() {
  if (!IS_DEV) {
    return `${process.env.FRONTEND_URL}/bot/message-actions.png`;
  }

  // Slack will reject localhost images, we need to use tunnel.
  // Note: it will hard-reject it, not sending message at all, not only not-loading the image.
  try {
    const tunnelUrl = await getDevPublicTunnelURL(3000);

    return `${tunnelUrl}/bot/message-actions.png`;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createHelpMessageForUser(slackUserId: string) {
  return Message().blocks(
    Section({
      text: [`Hey there 👋`, `Here are some useful commands you can try out!`].join("\n"),
    }),
    Section({
      text: [
        `1️⃣ ${Md.bold(`Use ${Md.codeInline("/acapela your message")} to create a new request`)}`,
        `For example: ${Md.quote(`/acapela can you forward the documentation to me, ${Md.user(slackUserId)}?`)}`,
      ].join("\n"),
    }),
    Context().elements(`Tip: mentioning other people to automatically include them in your request.`),
    //
    Section({
      text: [
        `2️⃣ ${Md.bold(`Use ${Md.codeInline("/acapela today")} to show daily overview`)}.`,
        `It will include all requests others sent to you`,
      ].join("\n"),
    }),
    Section({
      text: [
        sentences(
          `3️⃣ ${Md.bold(
            `Use ${Md.codeInline(
              "/acapela [request type] your message"
            )} to quickly create a new request without further details`
          )}`
        ),
      ].join("\n"),
    }),
    Context().elements(
      `Tip: There are 4 types of requests you can send to others: ${["response", "read", "action", "decision"]
        .map((item) => Md.codeInline(item))
        .join(" ")}`
    ),
    Section({
      text: [`4️⃣ ${Md.bold(`Use message actions`)}`, `To convert existing messages into requests.`].join("\n"),
    }),
    Image({ imageUrl: await getMessageActionsImageUrl(), altText: "Message actions", title: "Message actions" })
  );
}
