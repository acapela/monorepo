import { pick } from "lodash";
import { action, computed, extendObservable, makeAutoObservable, runInAction, toJS } from "mobx";

import { waitForEntityAllAwaitingPushOperations } from "~clientdb";
import { assert } from "~shared/assert";
import { typedKeys } from "~shared/object";

import { EntityDefinition } from "./definition";
import { DatabaseUtilities } from "./entitiesConnections";
import { EntityStore } from "./store";
import { EntityChangeSource } from "./types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type EntityMethods<Data, Connections> = {
  update(data: Partial<Data>, source?: EntityChangeSource): boolean;
  getData(): Data;
  getKey(): string;
  getKeyName(): string;
  getUpdatedAt(): Date;
  remove(source?: EntityChangeSource): void;
  waitForSync(): Promise<void>;
  definition: EntityDefinition<Data, Connections>;
  db: DatabaseUtilities;
};

export type Entity<Data, Connections> = Data & Connections & EntityMethods<Data, Connections>;

export type EntityByDefinition<Def> = Def extends EntityDefinition<infer Data, infer Connections>
  ? Entity<Data, Connections>
  : never;

export interface CreateEntityConfig {
  needsSync: boolean;
}

interface CreateEntityInput<D, C> {
  data: Partial<D>;
  definition: EntityDefinition<D, C>;
  store: EntityStore<D, C>;
  databaseUtilities: DatabaseUtilities;
}

export function createEntity<D, C>({
  data,
  definition,
  store,
  databaseUtilities,
}: CreateEntityInput<D, C>): Entity<D, C> {
  const { config } = definition;
  const dataWithDefaults: D = { ...config.getDefaultValues?.(databaseUtilities), ...data } as D;

  const rawDataKeys = typedKeys(dataWithDefaults);

  for (const requiredKey of config.keys ?? []) {
    assert(
      rawDataKeys.includes(requiredKey),
      `Required field "${requiredKey}" is missing when creating new entity ${definition.config.name}`
    );
  }

  const initialKey = data[config.keyField];

  const observableData = makeAutoObservable<D & object>(
    dataWithDefaults as D & object,
    config.customObservableAnnotations,
    {
      name: `${definition.config.name}-${initialKey}`,
    }
  );

  const connections =
    config.getConnections?.(observableData, {
      ...databaseUtilities,
      createCache(key, getter) {
        const id = observableData[config.keyField] as unknown as string;
        const updatedAt = new Date(observableData[config.updatedAtField] as unknown as string);

        return computed(() => {
          return databaseUtilities.entityCache.getCached(key, id, config.name, updatedAt, observableData, getter);
        });
      },
      updateSelf(data) {
        entity.update(data, "user");
      },
    }) ?? ({} as C);

  // Note: we dont want to add connections as {...data, ...connections}. Connections might have getters so it would simply unwrap them.

  const observableDataAndConnections = extendObservable(observableData, connections);

  function touchUpdatedAt() {
    // We dont know weather updated at is kept as date, string, or number stamp. Let's try to keep the type the same
    const existingDate = entity[config.updatedAtField];

    if (typeof existingDate === "string") {
      Reflect.set(entity, config.updatedAtField, new Date().toISOString());
      return;
    }

    if (typeof existingDate === "number") {
      Reflect.set(entity, config.updatedAtField, new Date().getTime());
      return;
    }

    Reflect.set(entity, config.updatedAtField, new Date());
  }

  const entityMethods: EntityMethods<D, C> = {
    definition,
    db: databaseUtilities,
    remove(source) {
      store.removeById(entityMethods.getKey(), source);
    },
    waitForSync() {
      return waitForEntityAllAwaitingPushOperations(entity);
    },
    getKey() {
      return `${entity[config.keyField]}`;
    },
    getKeyName() {
      return config.keyField as string;
    },
    getUpdatedAt() {
      const rawInfo = entity[config.updatedAtField];

      const updatedAt = new Date(rawInfo as unknown as string);

      if (isNaN(updatedAt.getTime())) {
        console.error({ entity });
        throw new Error(`Incorrect updated at value for key "${config.updatedAtField}"`);
      }

      return updatedAt;
    },
    getData() {
      const rawObject = toJS(entity);
      return pick(rawObject, rawDataKeys);
    },
    update(input, source: EntityChangeSource = "user") {
      const changedKeys = typedKeys(input).filter((keyToUpdate) => {
        const value = input[keyToUpdate];
        if (value === undefined) return false;

        const existingValue = entity[keyToUpdate];

        return value !== existingValue;
      });

      // No changes will be made, return early
      if (!changedKeys.length) return false;

      const dataBeforeUpdate = entity.getData();

      store.events.emit("itemWillUpdate", entity, input, source);

      runInAction(() => {
        changedKeys.forEach((keyToUpdate) => {
          const value = input[keyToUpdate];
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          (entity as D)[keyToUpdate] = value!;
        });

        touchUpdatedAt();
      });

      store.events.emit("itemUpdated", entity, dataBeforeUpdate, source);

      return true;
    },
  };

  const entity: Entity<D, C> = extendObservable(observableDataAndConnections, entityMethods, {
    getData: false,
    getKey: false,
    getKeyName: false,
    getUpdatedAt: false,
    definition: false,
    waitForSync: false,
    remove: action,
    update: action,
    db: false,
  });

  return entity;
}
