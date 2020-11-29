import { acceptInvite } from "../invites/acceptInvite";
import { upgradeCurrentUser } from "../users/upgradeUser";

export interface ActionHandler<DataT, ResponseT> {
  actionName: string;
  handle: (userId: string, data: DataT) => Promise<ResponseT>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlers: ActionHandler<any, any>[] = [acceptInvite, upgradeCurrentUser];
