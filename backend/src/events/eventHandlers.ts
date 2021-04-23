import { handleInviteCreated } from "../invites/events";
import { handleRoomCreated } from "../rooms/events";
import { handleMessageCreated } from "../messages/events";

export interface EventHandler<DataT> {
  triggerName: string;
  handleInsert?: (userId: string, newData: DataT) => Promise<void>;
  handleUpdate?: (userId: string, oldData: DataT, newData: DataT) => Promise<void>;
  handleDelete?: (userId: string, oldData: DataT) => Promise<void>;
  handleManual?: (userId: string, newData: DataT) => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlers: EventHandler<any>[] = [handleRoomCreated, handleInviteCreated, handleMessageCreated];
