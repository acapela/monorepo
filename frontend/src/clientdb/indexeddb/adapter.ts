import { IDBPDatabase, deleteDB, openDB } from "idb";

import { PersistanceAdapter, PersistanceDB, PersistanceTableAdapter } from "~clientdb";
import { wait } from "~shared/time";

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
    async openDB({ name, tables, version, onTerminated }) {
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
              onTerminated?.();
              console.error("Creating db terminated");
            },
          })
        );

        return db;
      }

      const db = await getOrReuseDb();

      const adapter: PersistanceDB = {
        async close() {
          db.close();
        },
        async getTable<Data>(name: string) {
          // Reusing write session instead of creating new one for each request reduced time of initial persistance (900 items) from ~10s to ~0.1s
          // This was quite serious bug, as if you refreshed the page in the mid of this persistance, you could leave local database in very inconstant state
          // that is impossible to recover from in easy way.
          const getWriteSession = createTickMemoize(async function getTransaction(clean) {
            const transaction = await db.transaction([name], "readwrite", { durability: "relaxed" });

            // IDB transactions are made 'complete' when JS yields to event loop. We're not able (AFAIK) to be so quick to clean it quickly enough
            // eg. setTimeout(clean, 0) will often be too late.
            // Thus we artifically keep it alive for a moment (note that it will already be cleared from memoize)
            // Not doing that risks reusing transaction that already 'yielded' and was auto-commited leading to error
            async function keepAlive() {
              await wait(5000);
              transaction.removeEventListener("complete", keepAlive);
            }

            transaction.addEventListener("complete", keepAlive);

            transaction.done.then(clean);

            const store = transaction.objectStore(name);

            return [store, transaction] as const;
          });

          const tableAdapter: PersistanceTableAdapter<Data> = {
            async fetchItem(key) {
              const [store] = await getWriteSession();
              return store.get(key);
            },
            async updateItem(key, input) {
              const [store] = await getWriteSession();
              const existingItem: Data | null = await store.get(key);

              if (existingItem === null) {
                return false;
              }

              const updateData: Data = { ...existingItem, ...input };

              await store.put(updateData);

              return true;
            },

            async clearTable() {
              const [store] = await getWriteSession();
              await store.clear();
              return true;
            },
            async fetchAllItems() {
              const [store] = await getWriteSession();
              return store.getAll();
            },
            async removeItem(itemId) {
              const [store] = await getWriteSession();
              await store.delete(itemId);
              return true;
            },
            async saveItem(data) {
              const [store] = await getWriteSession();

              await store.put(data);

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

function createTickMemoize<R>(getter: (clean: () => void) => R, cleanup?: (value: R) => void) {
  let valueBox: { value: R } | null = null;

  function cleanValue() {
    valueBox = null;
  }

  function getMemoized() {
    if (valueBox) {
      return valueBox.value;
    }

    const newValue = getter(cleanValue);
    valueBox = { value: newValue };

    setTimeout(() => {
      valueBox = null;
      cleanup?.(newValue);
    }, 0);

    return newValue;
  }

  return getMemoized;
}
