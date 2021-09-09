import { extend, pick } from "lodash";
import { extendObservable, makeAutoObservable, runInAction, toJS } from "mobx";

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
  getUpdatedAt(): Date;
  remove(): void;
};

export type Entity<Data, Connections> = Data & Connections & EntityMethods<Data, Connections>;

export type EntityByDefinition<Def> = Def extends EntityDefinition<infer Data, infer Connections>
  ? Entity<Data, Connections>
  : never;

function mergeProperties<I, A>(input: I, propertiesToAdd: A): I & A {
  const keysToAdd = Object.keys(propertiesToAdd);

  for (const keyToAdd of keysToAdd) {
    const descriptor = Object.getOwnPropertyDescriptor(propertiesToAdd, keyToAdd);

    if (!descriptor) continue;

    Object.defineProperty(input, keyToAdd, descriptor);
  }

  return input as I & A;
}

export type EntityFromDefinition<Def extends EntityDefinition<any, any>> = Def extends EntityDefinition<
  infer Data,
  infer Connections
>
  ? Entity<Data, Connections>
  : never;

export function createEntity<D, C>(
  data: D,
  definition: EntityDefinition<D, C>,
  store: EntityStore<D, C>,
  { getEntityClientByDefinition }: EntitiesConnectionsConfig
): Entity<D, C> {
  const { config, getConnections } = definition;
  const rawDataKeys = typedKeys(data);

  const observableData = makeAutoObservable(data as D & object);

  const connections =
    getConnections?.(observableData, {
      getEntity: getEntityClientByDefinition,
    }) ?? ({} as C);

  const observableDataAndConnections = extendObservable(observableData, connections);

  const entityMethods: EntityMethods<D, C> = {
    remove() {
      throw "unimplemented";
    },
    getKey() {
      return `${entity[config.keyField]}`;
    },
    getUpdatedAt() {
      const rawInfo = entity[config.updatedAtField];

      // TODO Validate
      return new Date(rawInfo as string);
    },
    getData() {
      const rawObject = toJS(entity);
      return pick(rawObject, rawDataKeys);
    },
    clone() {
      throw "un";
    },
    update(input) {
      runInAction(() => {
        typedKeys(input).forEach((keyToUpdate) => {
          const value = input[keyToUpdate]!;

          if (value === undefined) return;

          (entity as D)[keyToUpdate] = value;
        });
      });

      store.events.emit("itemUpdated", entity);
    },
    createDraft() {
      return createEntityDraft(entity, (draft) => {
        entity.update(draft);
        throw "un";
      });
    },
  };

  const entity: Entity<D, C> = extendObservable(observableDataAndConnections, entityMethods);

  return entity;
}
