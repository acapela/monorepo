import { EntitySyncConfig, defineEntity } from "~clientdb";

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

function getSyncConfig<T>(): EntitySyncConfig<T> {
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

export const testEntities = {
  dog,
  owner,
};

export type DefaultTestEntitiesData = {
  owner: TestOwnerEntity;
  dog: TestDogEntity;
};
