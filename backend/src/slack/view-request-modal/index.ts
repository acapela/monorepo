import { App, BlockButtonAction } from "@slack/bolt";
import type { View } from "@slack/types";

import { assert } from "~shared/assert";
import { Sentry } from "~shared/sentry";

import { slackClient } from "../app";
import { assertToken } from "../utils";
import { ViewRequestModal } from "./ViewRequestModal";

export function setupViewRequestModal(slackApp: App) {
  slackApp.action<BlockButtonAction>("open_view_request_modal", async ({ ack, context, body, action }) => {
    await ack();

    assert(body.team?.id, "team not present in slack");

    const token = assertToken(context);
    const triggerId = body.trigger_id;

    const openView = (view: View) => slackClient.views.open({ token, trigger_id: triggerId, view });

    try {
      await openView(
        await ViewRequestModal(token, {
          topicId: action.value,
          slackUserId: body.user.id,
        })
      );
    } catch (e) {
      Sentry.captureException(e);
    }
  });
}
