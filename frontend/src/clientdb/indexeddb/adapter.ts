import { IDBPDatabase, deleteDB, openDB } from "idb";

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
    const result = await callback();
    return result;
  } catch (error) {
    await deleteDB(databaseName);

    return await callback();
  }
}

const existingConnections = new Map<string, IDBPDatabase<unknown>>();

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
      async function getOrReuseDb() {
        const existingConnection = existingConnections.get(name);

        if (existingConnection && existingConnection.version !== version) {
          existingConnection.close();
          existingConnections.delete(name);
        }

        if (existingConnection && existingConnection.version == version) {
          return existingConnection;
        }

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
              /**
               * This is important! Lack of this callback can 'freeze' opening the app.
               *
               * Context: if you have 2 tabs opened with the app, but some of them is having 'older' db version, and you refresh never one
               * this callback will be called.
               *
               * TLDR: this callback = "if I am already opened, but someone else wants to upgrade db version (potentially in different tab!) - call this callback"
               */

              // If this happens, we indeed want to instantly close the connection and reload the page (it usually means user has 'old' tab opened for a long time!)
              db.close();
              window.location.reload();
            },
            terminated() {
              console.error("Creating db terminated");
            },
          })
        );

        return db;
      }

      const db = await getOrReuseDb();

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
