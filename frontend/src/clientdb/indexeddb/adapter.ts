import { deleteDB, openDB } from "idb";

import { PersistanceAdapter, PersistanceDB, PersistanceTableAdapter } from "~clientdb";

/**
 * This is IndexedDB adapter for clientdb that allows persisting all the data locally.
 */

/**
 * Will perform given operation, but on error will remove given database and try again.
 *
 * If fails again - will then just throw given error
 */
async function performDbCallbackTryingAgainOnError<T>(databaseName: string, callback: () => T) {
  try {
    return await callback();
  } catch (error) {
    await deleteDB(databaseName);

    return await callback();
  }
}

export function createIndexedDbAdapter(): PersistanceAdapter {
  return {
    async removeDB(name) {
      try {
        await deleteDB(name);
        return true;
      } catch (error) {
        return false;
      }
    },
    async openDB({ name, tables, version }) {
      const db = await performDbCallbackTryingAgainOnError(name, () =>
        openDB(name, version, {
          upgrade(database, oldVersion, newVersion) {
            // Each time new version of database is detected - wipe out entire data and re-create it
            console.info(`New database version - handling upgrade`, { oldVersion, newVersion });
            for (const existingStore of database.objectStoreNames) {
              database.deleteObjectStore(existingStore);
            }

            for (const entity of tables) {
              database.createObjectStore(entity.name, { keyPath: entity.keyField });
            }
          },
          blocked() {
            console.error("Creating db blocked");
          },
          blocking() {
            console.error("Creating db blocking");
          },
          terminated() {
            console.error("Creating db terminated");
          },
        })
      );

      const adapter: PersistanceDB = {
        async close() {
          return db.close();
        },
        async getTable<Data>(name: string) {
          async function getTransaction() {
            return await db.transaction([name], "readwrite").objectStore(name);
          }
          const tableAdapter: PersistanceTableAdapter<Data> = {
            async fetchItem(key) {
              const tr = await getTransaction();
              return tr.get(key);
            },
            async updateItem(key, input) {
              const tr = await getTransaction();
              const existingItem: Data | null = await tr.get(key);

              if (existingItem === null) {
                return false;
              }

              const updateData: Data = { ...existingItem, ...input };

              await tr.put(updateData);

              return true;
            },

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

          return tableAdapter;
        },
      };

      return adapter;
    },
  };
}
