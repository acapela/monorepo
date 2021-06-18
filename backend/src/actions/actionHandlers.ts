import { acceptInvite } from "../teamInvitation/acceptInvite";
import { getUploadUrl, getDownloadUrl } from "../attachments/attachments";
import { lookupTeamName } from "../teamInvitation/lookupTeamName";

export interface ActionHandler<DataT, ResponseT> {
  actionName: string;
  handle: (userId: string | undefined, data: DataT) => Promise<ResponseT>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlers: ActionHandler<any, any>[] = [acceptInvite, getUploadUrl, getDownloadUrl, lookupTeamName];
