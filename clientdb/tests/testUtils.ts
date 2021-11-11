import { EntitySyncConfig, PersistanceAdapterInfo } from "~clientdb/entity";

import { createClientDb, defineEntity } from "..";

interface CommonData {
  id: string;
  updatedAt: Date;
}

export interface TestOwnerEntity extends CommonData {
  name: string;
}

export interface TestDogEntity extends CommonData {
  name: string;
  owner_id: string;
}

let id = 0;

export function getDefaultCommonData(): CommonData {
  return {
    id: `${++id}`,
    updatedAt: new Date(),
  };
}

export function getSyncConfig<T>(): EntitySyncConfig<T> {
  return {
    pullUpdated({ updateItems }) {
      updateItems([]);
    },
  };
}

export const owner = defineEntity<TestOwnerEntity>({
  keyField: "id",
  keys: ["id", "name", "updatedAt"],
  updatedAtField: "updatedAt",
  name: "owner",
  sync: getSyncConfig<TestOwnerEntity>(),
  getDefaultValues: getDefaultCommonData,
}).addConnections((owner, { getEntity }) => {
  return {
    dogs: getEntity(dog).query({ owner_id: owner.id }),
  };
});

export const dog = defineEntity<TestDogEntity>({
  keyField: "id",
  keys: ["id", "name", "updatedAt", "owner_id"],
  updatedAtField: "updatedAt",
  name: "dog",
  sync: getSyncConfig<TestDogEntity>(),
  getDefaultValues: getDefaultCommonData,
}).addConnections((dog, { getEntity }) => {
  return {
    get owner() {
      return getEntity(owner).assertFindById(dog.owner_id);
    },
  };
});

export const mockPersistanceAdapter: PersistanceAdapterInfo = {
  adapter: {
    async openDB() {
      return {
        async close() {
          //
        },
        async getTable() {
          return {
            async clearTable() {
              return true;
            },
            async fetchAllItems() {
              return [];
            },
            async fetchItem() {
              return null;
            },
            async removeItem() {
              return true;
            },
            async removeItems() {
              return true;
            },
            async saveItem() {
              return true;
            },
            async saveItems() {
              return true;
            },
            async updateItem() {
              return true;
            },
          };
        },
      };
    },
    async removeDB() {
      return true;
    },
  },
};

export function createTestDb() {
  return createClientDb({ db: mockPersistanceAdapter }, { owner, dog });
}
