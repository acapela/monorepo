import { getUploadUrl } from "~backend/src/attachments/attachments";
import { inviteUser } from "~backend/src/inviteUser";
import { getTeamSlackInstallationURLHandler, slackUser, uninstallSlack } from "~backend/src/slack/hasuraActions";

export interface ActionHandler<DataT, ResponseT> {
  actionName: string;
  handle: (userId: string | undefined, data: DataT) => Promise<Omit<ResponseT, "__typename">>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlers: ActionHandler<any, any>[] = [
  getTeamSlackInstallationURLHandler,
  getUploadUrl,
  inviteUser,
  slackUser,
  uninstallSlack,
];
