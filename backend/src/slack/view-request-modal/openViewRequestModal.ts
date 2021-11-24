import type { View } from "@slack/types";
import { Modal } from "slack-block-builder";

import { db } from "~db";
import { assert } from "~shared/assert";

import { slackClient } from "../app";
import { ViewMetadata, attachToViewWithMetadata } from "../utils";

const ViewRequestModal = (metadata: ViewMetadata["view_request_modal"]) => {
  return Modal({
    title: `TOPIC ${metadata.topic.name}`,
    ...attachToViewWithMetadata("view_request_modal", metadata),
  }).buildToObject();
};

export async function openViewRequestModal(
  token: string,
  triggerId: string,
  data: ViewMetadata["open_view_request_modal"]
) {
  const { topicId } = data;
  const openView = (view: View) => slackClient.views.open({ token, trigger_id: triggerId, view });

  const topic = await db.topic.findFirst({ where: { id: topicId } });

  assert(topic, "topic provided doesn't exist");

  await openView(ViewRequestModal({ topic }));
}
