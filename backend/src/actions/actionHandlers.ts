import { getUploadUrl } from "~backend/src/attachments/attachments";
import { roomInvitationView } from "~backend/src/roomInvitation/roomInvitationView";
import { lookupTeamName } from "~backend/src/teamInvitation/lookupTeamName";
import { resendInvitation } from "~backend/src/teamInvitation/resendInvitation";

export interface ActionHandler<DataT, ResponseT> {
  actionName: string;
  handle: (userId: string | undefined, data: DataT) => Promise<ResponseT>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlers: ActionHandler<any, any>[] = [getUploadUrl, lookupTeamName, resendInvitation, roomInvitationView];
