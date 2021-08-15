import { EntityDefinition } from "./definition";
import { EntityClient } from "./client";
import { createEntityDraft, EntityDraft } from "./draft";
import { EntitySyncConfig } from "./sync";
import { makeAutoObservable } from "mobx";
import { EntitiesConnectionsConfig } from "./entitiesConnections";
import { typedKeys } from "~shared/object";

export type Entity<Data, Connections> = Data &
  Connections & {
    createDraft(): EntityDraft<Data>;
    clone(): Entity<Data, Connections>;
    update(data: Partial<Data>): void;
  };

export function createEntity<D, C>(
  data: D,
  definition: EntityDefinition<D, C>,
  { getEntityClientByDefinition }: EntitiesConnectionsConfig
): Entity<D, C> {
  const { config, getConnections } = definition;

  const connections = getConnections(data, {
    getEntity: getEntityClientByDefinition,
  });

  const dataAndConnections: D & C = { ...data, ...connections };

  const entity: Entity<D, C> = makeAutoObservable({
    ...dataAndConnections,
    clone() {
      throw "un";
    },
    update(input) {
      typedKeys(input).forEach((keyToUpdate) => {
        const value = input[keyToUpdate];

        if (value === undefined) return;

        (entity as D)[keyToUpdate] = value as D[keyof D];
      });
    },
    createDraft() {
      return createEntityDraft(entity, () => {
        throw "un";
      });
    },
  });

  return entity;
}
