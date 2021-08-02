import { getUploadUrl, getDownloadUrl } from "~backend/src/attachments/attachments";
import { lookupTeamName } from "~backend/src/teamInvitation/lookupTeamName";
import { roomInvitationView } from "~backend/src/roomInvitation/roomInvitationView";

export interface ActionHandler<DataT, ResponseT> {
  actionName: string;
  handle: (userId: string | undefined, data: DataT) => Promise<ResponseT>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlers: ActionHandler<any, any>[] = [getUploadUrl, getDownloadUrl, lookupTeamName, roomInvitationView];
