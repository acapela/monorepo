import { getUploadUrl } from "~backend/src/attachments/attachments";
import { roomInvitationView } from "~backend/src/roomInvitation/roomInvitationView";
import { findSlackUser, getTeamSlackInstallationURL } from "~backend/src/slack/install";
import { lookupTeamName } from "~backend/src/teamInvitation/lookupTeamName";
import { resendInvitation } from "~backend/src/teamInvitation/resendInvitation";

export interface ActionHandler<DataT, ResponseT> {
  actionName: string;
  handle: (userId: string | undefined, data: DataT) => Promise<Omit<ResponseT, "__typename">>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlers: ActionHandler<any, any>[] = [
  findSlackUser,
  getTeamSlackInstallationURL,
  getUploadUrl,
  lookupTeamName,
  resendInvitation,
  roomInvitationView,
];
