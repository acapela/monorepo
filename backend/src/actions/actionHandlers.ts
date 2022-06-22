import { linearUsers } from "@aca/backend/src/linear/hasuraActions";
import { sendMessage } from "@aca/backend/src/sendMessage/hasuraActions";
import {
  getIndividualSlackInstallationURLHandler,
  handleRevertUrlView,
  slackConversations,
  slackUsers,
  updateSlackMessagesReadStatus,
} from "@aca/backend/src/slack/hasuraActions";
import { switchSubscriptionPlanAction } from "@aca/backend/src/subscription";

export interface ActionHandler<DataT, ResponseT> {
  actionName: string;
  handle: (userId: string | undefined, data: DataT) => Promise<Omit<ResponseT, "__typename">>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlers: ActionHandler<any, any>[] = [
  getIndividualSlackInstallationURLHandler,
  linearUsers,
  slackUsers,
  slackConversations,
  switchSubscriptionPlanAction,
  handleRevertUrlView,
  updateSlackMessagesReadStatus,
  sendMessage,
];
