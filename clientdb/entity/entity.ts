import { pick } from "lodash";
import { extendObservable, makeAutoObservable, runInAction, toJS } from "mobx";

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
  remove(): void;
};

export type Entity<Data, Connections> = Data & Connections & EntityMethods<Data, Connections>;

export type EntityByDefinition<Def> = Def extends EntityDefinition<infer Data, infer Connections>
  ? Entity<Data, Connections>
  : never;

export type EntityFromDefinition<Def extends EntityDefinition<unknown, unknown>> = Def extends EntityDefinition<
  infer Data,
  infer Connections
>
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
  const { config, getConnections } = definition;
  const dataWithDefaults: D = { ...config.getDefaultValues?.(databaseUtilities), ...data } as D;

  const rawDataKeys = typedKeys(dataWithDefaults);

  for (const requiredKey of config.keys ?? []) {
    assert(
      rawDataKeys.includes(requiredKey),
      `Required field "${requiredKey}" is missing when creating new entity ${definition.config.name}`
    );
  }

  const observableData = makeAutoObservable(dataWithDefaults as D & object);

  const connections =
    getConnections?.(observableData, {
      ...databaseUtilities,
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
    remove() {
      store.removeById(entityMethods.getKey());
    },
    getKey() {
      return `${entity[config.keyField]}`;
    },
    getKeyName() {
      return config.keyField as string;
    },
    getUpdatedAt() {
      const rawInfo = entity[config.updatedAtField];

      const updatedAt = new Date(rawInfo as string);

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
      let updatedFieldsCount = 0;
      runInAction(() => {
        typedKeys(input).forEach((keyToUpdate) => {
          const value = input[keyToUpdate];

          if (value === undefined) return;

          const existingValue = entity[keyToUpdate];

          if (existingValue === value) {
            return;
          }

          updatedFieldsCount++;

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          (entity as D)[keyToUpdate] = value!;
        });

        if (updatedFieldsCount) {
          touchUpdatedAt();
        }
      });

      if (updatedFieldsCount) {
        store.events.emit("itemUpdated", entity, source);
      }

      return updatedFieldsCount > 0;
    },
  };

  const entity: Entity<D, C> = extendObservable(observableDataAndConnections, entityMethods);

  return entity;
}
