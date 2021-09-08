export interface DbEntityInfo {
  name: string;
  keyField: string;
}

export interface DbInfo {
  dbPrefix: string;
  dbVersion: number;
  entities: DbEntityInfo[];
}

export interface EntityDbInfo extends DbInfo {
  entityName: string;
}

export interface SaveItemInput<Data> extends EntityDbInfo {
  item: Data;
}

export interface RemoveItemInput extends EntityDbInfo {
  itemId: string;
}

interface GetTableConfig<Data> {
  name: string;
  keyField: keyof Data;
}

export interface LocalDbTableAdapter<Data> {
  saveItem(key: string, input: Data): Promise<boolean>;
  removeItem(key: string): Promise<boolean>;
  fetchAllItems(): Promise<Data[]>;
  removeTable(): Promise<boolean>;
  clearTable(): Promise<boolean>;
}

export interface ClientAdapterConfig {
  dbAdapter: LocalDbAdapter;
  dbVersion: number;
  dbPrefix: string;
}

export interface LocalDbAdapter {
  getTable<Data>(conifg: GetTableConfig<Data>): Promise<LocalDbTableAdapter<Data>>;
  initialize(input: DbInfo): Promise<boolean>;
}
