import { IDBPDatabase, openDB } from "idb";
import { memoize } from "lodash";

import { DbInfo, LocalDbAdapter } from "~clientdb/entity/db/adapter";
import { assert } from "~shared/assert";
import { createResolvablePromise } from "~shared/promises";

/**
 * This is IndexedDB adapter for clientdb that allows persisting all the data locally.
 */

async function initializeDb({ dbVersion, dbPrefix, entities }: DbInfo) {
  const db = await openDB(`${dbPrefix}-clientdb`, dbVersion, {
    upgrade(database, oldVersion, newVersion) {
      // Each time new version of database is detected - wipe out entire data and re-create it
      console.info(`New database version - handling upgrade`, { oldVersion, newVersion });
      for (const existingStore of database.objectStoreNames) {
        database.deleteObjectStore(existingStore);
      }

      for (const entity of entities) {
        database.createObjectStore(entity.name, { keyPath: entity.keyField });
      }
    },
  });

  return db;
}

export function createIndexedDbAdapter(): LocalDbAdapter {
  const [dbPromise, resolveDb] = createResolvablePromise<IDBPDatabase>();

  const initialize = memoize(async (dbInfo: DbInfo) => {
    const initializedDb = await initializeDb(dbInfo);
    resolveDb(initializedDb);

    return true;
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function getTableTransaction(name: string, keyField: string) {
    assert(dbPromise, "not initialized");

    const db = await dbPromise;

    return await db.transaction([name], "readwrite").objectStore(name);
  }

  const indexedDbAdapter: LocalDbAdapter = {
    initialize,
    async getTable({ keyField, name }) {
      assert(dbPromise, "not initialized");

      async function getTransaction() {
        return await getTableTransaction(name, keyField as string);
      }

      return {
        async clearTable() {
          const tr = await getTransaction();
          await tr.clear();
          return true;
        },
        async fetchAllItems() {
          const tr = await getTransaction();
          return tr.getAll();
        },
        async removeItem(itemId) {
          const tr = await getTransaction();
          await tr.delete(itemId);
          return true;
        },
        async saveItem(itemId, data) {
          const tr = await getTransaction();

          await tr.put(data);
          return true;
        },
      };
    },
  };

  return indexedDbAdapter;
}
