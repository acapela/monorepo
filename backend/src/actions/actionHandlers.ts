import { getUploadUrl } from "@aca/backend/src/attachments/attachments";
import { inviteUser } from "@aca/backend/src/inviteUser";
import { getIndividualSlackInstallationURLHandler } from "@aca/backend/src/notificationCapture/hasuraActions";
import {
  getTeamSlackInstallationURLHandler,
  slackUser,
  slackUsers,
  uninstallSlack,
} from "@aca/backend/src/slack/hasuraActions";
import { joinTopicHandler } from "@aca/backend/src/topics/actions";

export interface ActionHandler<DataT, ResponseT> {
  actionName: string;
  handle: (userId: string | undefined, data: DataT) => Promise<Omit<ResponseT, "__typename">>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlers: ActionHandler<any, any>[] = [
  getIndividualSlackInstallationURLHandler,

  getTeamSlackInstallationURLHandler,
  getUploadUrl,
  inviteUser,
  joinTopicHandler,
  slackUser,
  slackUsers,
  uninstallSlack,
];
