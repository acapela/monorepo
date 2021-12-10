import { App, BlockButtonAction } from "@slack/bolt";

import { assert } from "~shared/assert";

import { slackClient } from "../app";
import { SlackActionIds, assertToken } from "../utils";
import { ViewRequestModal, setupViewRequestModalActions } from "./ViewRequestModal";

export function setupViewRequestModal(slackApp: App) {
  const actionIdRegex = new RegExp(SlackActionIds.OpenViewRequestModal + ":?.*");
  slackApp.action<BlockButtonAction>(actionIdRegex, async ({ ack, context, body, action }) => {
    await ack();

    assert(body.team?.id, "team not present in slack");

    const token = assertToken(context);
    const triggerId = body.trigger_id;

    const actionParamString = action.action_id.slice(SlackActionIds.OpenViewRequestModal.length + 1);
    const actionParams = actionParamString ? JSON.parse(actionParamString) : null;

    const viewParams = {
      token,
      trigger_id: triggerId,
      view: await ViewRequestModal(
        token,
        {
          topicId: action.value ?? actionParams.topicId,
          slackUserId: body.user.id,
        },
        actionParams?.page
      ),
    };
    if (body.view?.type == "modal" && body.view?.id) {
      await slackClient.views.update({ ...viewParams, view_id: body.view.id });
    } else {
      await slackClient.views.open(viewParams);
    }
  });

  setupViewRequestModalActions(slackApp);
}
