import { pick } from "lodash";
import { makeAutoObservable, runInAction } from "mobx";

import { typedKeys } from "~shared/object";

import { EntityClient } from "./client";
import { EntityDefinition } from "./definition";
import { EntityDraft, createEntityDraft } from "./draft";
import { EntitiesConnectionsConfig } from "./entitiesConnections";
import { EntityStore } from "./store";
import { EntitySyncConfig } from "./sync";

type EntityMethods<Data, Connections> = {
  createDraft(): EntityDraft<Data>;
  clone(): Entity<Data, Connections>;
  update(data: Partial<Data>): void;
  getData(): Data;
  getKey(): string;
};

export type Entity<Data, Connections> = Data & Connections & EntityMethods<Data, Connections>;

function mergeProperties<I, A>(input: I, propertiesToAdd: A): I & A {
  const keysToAdd = Object.keys(propertiesToAdd);

  for (const keyToAdd of keysToAdd) {
    const descriptor = Object.getOwnPropertyDescriptor(propertiesToAdd, keyToAdd);

    if (!descriptor) continue;

    Object.defineProperty(input, keyToAdd, descriptor);
  }

  return input as I & A;
}

export function createEntity<D, C>(
  data: D,
  definition: EntityDefinition<D, C>,
  store: EntityStore<D, C>,
  { getEntityClientByDefinition }: EntitiesConnectionsConfig
): Entity<D, C> {
  const { config, getConnections } = definition;

  const connections = getConnections(data, {
    getEntity: getEntityClientByDefinition,
  });

  const rawDataKeys = typedKeys(data);

  const entityRawData = { ...data };

  const entityWithConnectionsRawData = mergeProperties(entityRawData, connections);

  const entityMethods: EntityMethods<D, C> = {
    getKey() {
      return `${entity[config.keyField]}`;
    },
    getData() {
      const foo: D = pick(entity, rawDataKeys);

      return foo;
      // TODO: get data after updates
      return entityRawData;
    },
    clone() {
      throw "un";
    },
    update(input) {
      runInAction(() => {
        typedKeys(input).forEach((keyToUpdate) => {
          const value = input[keyToUpdate];

          if (value === undefined) return;

          (entity as D)[keyToUpdate] = value as D[keyof D];
        });
      });

      store.events.emit("itemUpdated", entity);
    },
    createDraft() {
      return createEntityDraft(entity, () => {
        throw "un";
      });
    },
  };

  const entity: Entity<D, C> = mergeProperties(entityWithConnectionsRawData, entityMethods);

  return entity;
}
