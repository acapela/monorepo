import { App, BlockButtonAction } from "@slack/bolt";
import { orderBy } from "lodash";
import { Blocks, Elements, Md, Modal } from "slack-block-builder";

import { slackClient } from "@aca/backend/src/slack/app";
import { ViewRequestModal } from "@aca/backend/src/slack/view-request-modal/ViewRequestModal";
import { DecisionOption, DecisionVote, User, db } from "@aca/db";
import { REQUEST_DECISION } from "@aca/shared/requests";
import { routes } from "@aca/shared/routes";

import { createSlackLink } from "./md/utils";
import { assertToken, findUserBySlackId, getViewOrigin } from "./utils";

const DECISION_VOTE_ACTION_ID = "decision_option-vote";

export function setupDecision(app: App) {
  app.action<BlockButtonAction>(DECISION_VOTE_ACTION_ID, async ({ ack, action, client, body, context }) => {
    await ack();

    const token = assertToken(context);
    const user = await findUserBySlackId(token, body.user.id);

    const decisionOption = user
      ? await db.decision_option.findFirst({
          where: { id: action.value, message: { task: { some: { user_id: user.id, type: REQUEST_DECISION } } } },
          include: { message: { include: { topic: true } }, decision_vote: { where: { user_id: user.id } } },
        })
      : null;

    if (!user || !decisionOption) {
      await client.views.open({
        trigger_id: body.trigger_id,
        view: Modal({ title: "No Vote" })
          .blocks(
            user
              ? Blocks.Section({
                  text: "You were not asked to vote in this decision, so this button does not do anything.",
                })
              : Blocks.Section({
                  text: `We could not find an Acapela user for you. Make sure ${createSlackLink(
                    process.env.FRONTEND_URL + routes.settings,
                    "to link your Slack account in your Acapela team settings"
                  )} so that you can vote on decisions through Slack.`,
                })
          )
          .buildToObject(),
      });
      return;
    }

    const { topic } = decisionOption.message;
    await db.$transaction(async (db) => {
      const votes = await db.decision_vote.findMany({
        where: { user_id: user.id, decision_option: { message_id: decisionOption.message_id } },
      });
      await db.decision_vote.deleteMany({ where: { id: { in: votes.map((vote) => vote.id) } } });

      // our deletion sync system can not automatically handle entities deleted through the backend at the moment
      // so we have to manually create a sync request
      await db.sync_request.createMany({
        data: votes.map((vote) => ({
          entity_name: "decision_vote",
          entity_id: vote.id,
          change_type: "delete",
          team_id: topic.team_id,
          user_id: user.id,
          date: new Date().toISOString(),
        })),
      });

      const shouldAddVote = decisionOption.decision_vote.length == 0; // whether they have not voted for this option yet
      if (shouldAddVote) {
        await db.decision_vote.create({
          data: {
            user_id: user.id,
            decision_option_id: decisionOption.id,
          },
        });
      }

      await db.task.updateMany({
        where: { user_id: user.id, message_id: decisionOption.message_id },
        data: {
          done_at: shouldAddVote ? new Date().toISOString() : null,
        },
      });
      if (decisionOption.message.is_first_completion_enough) {
        await db.topic.update({
          where: { id: topic.id },
          data: { closed_at: new Date().toISOString(), closed_by_user_id: user.id },
        });
      }
    });

    if (getViewOrigin(body.view) == "slack-view-request-modal") {
      await slackClient.views.update({
        token,
        view_id: body.view?.id,
        view: await ViewRequestModal(token, {
          slackUserId: body.user.id,
          topicId: topic.id,
        }),
      });
    }
  });
}

const EMOJI_NUMBERS = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
const emojifyNumber = (n: number) =>
  n
    .toString()
    .split("")
    .map((n) => EMOJI_NUMBERS[parseInt(n)])
    .join("");

export type DecisionOptionWithVotes = DecisionOption & { decision_vote: (DecisionVote & { user: User })[] };

export const DecisionOptionVoting = (options: DecisionOptionWithVotes[], slackUsers: Record<string, string>) =>
  orderBy(options, "index").map(({ id, option, index, decision_vote }) => {
    const emojiNo = emojifyNumber(index + 1);
    return Blocks.Section({
      text:
        emojiNo +
        " " +
        option +
        (decision_vote.length == 0
          ? ""
          : " " +
            Md.codeInline(String(decision_vote.length)) +
            "\n" +
            decision_vote
              .map(({ user }) => (slackUsers[user.id] ? Md.user(slackUsers[user.id]) : Md.italic(user.name)))
              .join(", ")),
    }).accessory(Elements.Button({ text: emojiNo, actionId: DECISION_VOTE_ACTION_ID, value: id }));
  });
