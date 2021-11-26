import { App, BlockButtonAction } from "@slack/bolt";

import { assert } from "~shared/assert";
import { Sentry } from "~shared/sentry";

import { assertToken } from "../utils";
import { openViewRequestModal } from "./openViewRequestModal";

export function setupViewRequestModal(slackApp: App) {
  slackApp.action<BlockButtonAction>("open_view_request_modal", async ({ ack, context, body, action }) => {
    await ack();

    assert(body.team?.id, "team not present in slack");

    try {
      await openViewRequestModal(assertToken(context), body.trigger_id, {
        topicId: action.value,
        slackTeamId: body.team.id,
        slackUserId: body.user.id,
      });
    } catch (e) {
      Sentry.captureException(e);
    }
  });
}
