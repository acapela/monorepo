import { pick } from "lodash";
import { extendObservable, makeAutoObservable, runInAction, toJS } from "mobx";

import { typedKeys } from "~shared/object";

import { EntityDefinition } from "./definition";
import { EntityDraft, createEntityDraft } from "./draft";
import { EntitiesConnectionsConfig } from "./entitiesConnections";
import { EntityStore } from "./store";

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
      store.removeById(entityMethods.getKey());
    },
    getKey() {
      return `${entity[config.keyField]}`;
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
