import { getHash } from "~shared/hash";

import { PersistanceAdapter, PersistanceAdapterInfo, PersistanceDB, PersistanceTableConfig } from "./db/adapter";
import { EntityDefinition } from "./definition";

/**
 * This file is responsible for setting up persistance database.
 * It can potentially detect schema change and wipe out currently persisted data.
 *
 * Steps are:
 * 1. Setup 'system' database that holds information about all already existing storage databases and their schema hash.
 * 2. Setup 'current schema hash' and compare it with last one, if it changed - wipe out persisted data.
 */

// Name of 'system' database holding persistance storages with their schema hash
const DATABASES_DB_NAME = "clientdb-databases";
// Table we use in database above.
const DATABASES_DB_TABLE = "databases";

/**
 * What kind of data we hold about existing storage databases
 *
 * Note: this is part of 'system' database we should try to really rarely change.
 */
interface StoragePersistanceDatabaseInfo {
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt: Date;
  name: string;
  version: number;
  schemaHash: string;
}

/**
 * We should hopefully never have to change this number, but in case we need to force-wipe-out entire data including system info,
 * we can upgrade this.
 *
 * Note: this version is independent from 'storage' database. This is for 'system info' database.
 */
const SYSTEM_DB_VERSION = 1;

/**
 * Will calculate schema hash for all entity definitions combined.
 */
function getDefinitionsSchemaHash(definitions: EntityDefinition<unknown, unknown>[]): string {
  const hashList = definitions.map((definition) => definition.getSchemaHash());

  return getHash(hashList.join(""));
}

/**
 * Will create persistance table info from entity definition
 */
function getTablesConfigFromDefinitions(definitions: EntityDefinition<unknown, unknown>[]): PersistanceTableConfig[] {
  return definitions.map((definition): PersistanceTableConfig => {
    return { name: definition.config.name, keyField: definition.config.keyField };
  });
}

/**
 * Will open and return 'system' table holding info about all existing databases.
 */
async function openLocalDatabasesInfoTable({ openDb }: PersistanceAdapter) {
  const databasesListDb = await openDb({
    name: DATABASES_DB_NAME,
    version: SYSTEM_DB_VERSION,
    tables: [{ name: DATABASES_DB_TABLE, keyField: "name" as keyof StoragePersistanceDatabaseInfo }],
  });

  const databasesListTable = await databasesListDb.getTable<StoragePersistanceDatabaseInfo>(DATABASES_DB_TABLE);

  return databasesListTable;
}

/**
 * To avoid conflicts with other IndexedDb we always add clientdb string to database name.
 */
const STORAGE_DATABASE_NAME_BASE = "clientdb-storage";

function getStorageDatabaseName(suffix?: string) {
  if (!suffix) {
    return STORAGE_DATABASE_NAME_BASE;
  }

  return `${STORAGE_DATABASE_NAME_BASE}-${suffix}`;
}

/**
 * Will setup persistance storage database, and if needed wipe out existing data on schema change.
 */
export async function initializePersistance(
  definitions: EntityDefinition<unknown, unknown>[],
  { adapter, nameSuffix }: PersistanceAdapterInfo
): Promise<PersistanceDB> {
  const databaseName = getStorageDatabaseName(nameSuffix);
  const allDatabasesInfoSystemTable = await openLocalDatabasesInfoTable(adapter);

  const existingDatabaseInfo = await allDatabasesInfoSystemTable.fetchItem(databaseName);

  const entityTablesInfo = getTablesConfigFromDefinitions(definitions);

  const currentSchemaHash = getDefinitionsSchemaHash(definitions);
  const now = new Date();

  // It is new database, no need to check hashes, just create and register it
  if (!existingDatabaseInfo) {
    // Initialize storage with initial version
    const persistanceDB = await adapter.openDb({ name: databaseName, version: 1, tables: entityTablesInfo });

    // Register metadata about the storage
    await allDatabasesInfoSystemTable.saveItem(databaseName, {
      name: databaseName,
      version: 1,
      createdAt: now,
      lastUsedAt: now,
      schemaHash: currentSchemaHash,
      updatedAt: now,
    });
    return persistanceDB;
  }

  // We have persistance table already. Let's see if schema it has is matching current schema

  // Let's also mark it as being used.
  await allDatabasesInfoSystemTable.updateItem(existingDatabaseInfo.name, { lastUsedAt: new Date() });

  const previousHash = existingDatabaseInfo.schemaHash;

  // Schema did change. Let's upgrade version forcing data wipe-out.
  if (currentSchemaHash !== previousHash) {
    const newVersion = existingDatabaseInfo.version + 1;
    const persistanceDB = await adapter.openDb({ name: databaseName, version: newVersion, tables: entityTablesInfo });
    // Let's register version change.
    await allDatabasesInfoSystemTable.updateItem(databaseName, {
      version: newVersion,
      schemaHash: currentSchemaHash,
      updatedAt: now,
    });
    return persistanceDB;
  }

  // We have persistance database already, and schema did not change. There is no need to make any changes to it

  // Let's open DB using current version - it means no update migration will be performed and data will be untouched.
  const persistanceDB = await adapter.openDb({
    name: databaseName,
    // We're passing existing version
    version: existingDatabaseInfo.version,
    tables: entityTablesInfo,
  });
  return persistanceDB;
}
