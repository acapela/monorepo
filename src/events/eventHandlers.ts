export interface EventHandler<DataT> {
  triggerName: string;
  handleInsert?: (userId: string, newData: DataT) => Promise<void>;
  handleUpdate?: (userId: string, oldData: DataT, newData: DataT) => Promise<void>;
  handleDelete?: (userId: string, oldData: DataT) => Promise<void>;
  handleManual?: (userId: string, newData: DataT) => Promise<void>;
}

export const handlers: EventHandler<unknown>[] = [];
