import { getUploadUrl, getDownloadUrl } from "~backend/src/attachments/attachments";
import { lookupTeamName } from "~backend/src/teamInvitation/lookupTeamName";
import { resendInvitation } from "~backend/src/teamInvitation/resendInvitation";
import { roomInvitationView } from "~backend/src/roomInvitation/roomInvitationView";
import { getTeamSlackInstallationURL } from "~backend/src/slack";

export interface ActionHandler<DataT, ResponseT> {
  actionName: string;
  handle: (userId: string | undefined, data: DataT) => Promise<ResponseT>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlers: ActionHandler<any, any>[] = [
  getUploadUrl,
  getDownloadUrl,
  lookupTeamName,
  resendInvitation,
  roomInvitationView,
  getTeamSlackInstallationURL,
];
