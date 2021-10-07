export interface PersistanceTableConfig {
  name: string;
  keyField: string;
}

export interface PersistanceTableAdapter<Data> {
  saveItem(key: string, input: Data): Promise<boolean>;
  removeItem(key: string): Promise<boolean>;
  fetchAllItems(): Promise<Data[]>;
  fetchItem(key: string): Promise<Data | null>;
  updateItem(key: string, input: Partial<Data>): Promise<boolean>;
  clearTable(): Promise<boolean>;
}

export interface PersistanceAdapterInfo {
  adapter: PersistanceAdapter;
  nameSuffix?: string;
}

export interface PersistanceDbOpenInput {
  name: string;
  version: number;
  tables: PersistanceTableConfig[];
}

export interface PersistanceDB {
  getTable<Data>(name: string): Promise<PersistanceTableAdapter<Data>>;
}

export interface PersistanceAdapter {
  openDb(input: PersistanceDbOpenInput): Promise<PersistanceDB>;
  removeDb(name: string): Promise<boolean>;
}
