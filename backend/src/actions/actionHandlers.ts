import { githubInstallations } from "@aca/backend/src/github/hasuraActions";
import { linearUsers } from "@aca/backend/src/linear/hasuraActions";
import {
  getIndividualSlackInstallationURLHandler,
  slackConversations,
  slackUsers,
} from "@aca/backend/src/slack/hasuraActions";

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
  githubInstallations,
];
