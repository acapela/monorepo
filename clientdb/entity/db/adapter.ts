interface DbInfo {
  dbPrefix: string;
  dbVersion: number;
}

interface EntityDbInfo extends DbInfo {
  entityName: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LocalDbFetchAllInput extends EntityDbInfo {}

interface SaveItemInput<Data> extends EntityDbInfo {
  item: Data;
}

interface RemoveItemInput extends EntityDbInfo {
  itemId: string;
}

export interface LocalDbAdapter {
  fetchEntityAll<Data>(input: LocalDbFetchAllInput): Promise<Data[]>;
  saveItem<Data>(input: SaveItemInput<Data>): Promise<boolean>;
  removeItem(input: RemoveItemInput): Promise<boolean>;
  clearEntity(input: EntityDbInfo): Promise<boolean>;
  initialize(input: DbInfo): Promise<boolean>;
  fetchSystemInfo<Data>(db: DbInfo, key: string): Promise<Data>;
  saveSystemInfo<Data>(db: DbInfo, key: string, value: Data): Promise<boolean>;
}
